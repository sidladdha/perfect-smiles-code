# Perfect Smiles — Live Site Deep-Dive Review
**Date:** 2026-08-30 · Code reviewed: the deployed `perfect-smiles-clinic-website-updated` codebase (`src/App.jsx`, `src/main.jsx`)
**Method:** full read of the data layer + automated browser tests against your exact code (findings marked "tested" were reproduced, not guessed).

Legend: ✅ EASY FIX = small, safe, no redesign needed · ⚙️ MEDIUM = needs a decision or careful change · 🏗 ARCH = structural, see Part 2

---

# Part 1 — How records are tied together (the data model)

Everything lives in one Supabase table (`clinic_storage`) as five JSON documents:

```
patients-index        [{id, name, age, phone}]            ← the sidebar list
patient:<id>          {…full record, visits:[{…, prescriptionImage, billed, paid}]}
appointments-index    [{id, patientId, patientName, phone, date, time, status, reminded}]
collections-log       [{id, visitId, patientId, patientName, amount, billed, pending, date}]
activity-log          [{id, ts, actor, role, action, target}]   (capped 500)
```

The ties are **by copied value, not by reference**:
- An appointment stores a *copy* of the patient's name and phone (for display + WhatsApp links).
- A collections entry stores a *copy* of the patient's name and the visit's amounts, linked by `visitId` and `patientId`.
- The activity log stores plain text snapshots (intentionally — it's history).

Copied values are fast to display but **must be re-synced whenever the source changes** — and that's exactly where the bugs live.

## What propagates today (verified by test)

| You do this | Patient record | Sidebar list | Appointments | Collections | Verdict |
|---|---|---|---|---|---|
| Edit patient phone/name | ✓ updated | ✓ updated | ✗ **keeps old phone/name** | ✗ keeps old name | 🔴 broken |
| Delete patient | ✓ deleted | ✓ removed | ✗ **ghost stays, WhatsApp button live** | left (see below) | 🔴 broken |
| Edit visit (amounts) | ✓ | – | – | ✓ resynced | ✓ OK |
| Delete visit | ✓ | – | – | ✓ entries removed | ✓ OK |
| Edit appointment | – | – | ✓ + reminder flag reset | – | ✓ OK (nice touch) |
| Delete appointment | n/a — there is **no delete**, only cancel | | | | ⚙️ by design? |

# Part 1b — The bug list

### 🔴 Critical — and ✅ EASY FIX (I have tested fixes ready for all four)

**1. Edited phone/name never reaches appointments.** *(tested: confirmed stale)* Reception fixes a patient's number, then sends a WhatsApp reminder from the Reminders tab — it goes to the **old number**. Fix: on patient edit, rewrite that patient's appointments (match by `patientId`). ~8 lines.

**2. Deleting a patient leaves ghost appointments.** *(tested: confirmed)* The confirm says "remove this patient and all their records", but their scheduled appointments stay in Today/Reminders with a working "Send Reminder" button — you can message a deleted patient. Fix: filter `appointments-index` by `patientId` on delete. ~4 lines.

**3. "Today" is computed in UTC.** For India (UTC+5:30) the app's date flips at 5:30 AM — an appointment or payment entered before that files under **yesterday**; `addDaysStr` can even return the same day for +1, which quietly breaks the 3-day reminder window. Daily Collections totals and the Excel export group by these dates. Fix: build the date string from local time. ~6 lines.

**4. A connection failure looks like an empty clinic.** All load errors are swallowed; if Supabase is unreachable (or the free-tier project is paused after inactivity), staff see "No patients yet" — inviting them to re-enter patients as duplicates. Fix: distinguish network errors from empty data, show a "couldn't load — don't re-enter records" banner with Retry. ~25 lines.

### 🟠 High — worth deciding soon

**5. Unpaid visits are invisible in Collections.** ⚙️ `addCollectionEntry` skips any visit with `paid = 0` — so a fully-unpaid bill produces **no entry**, and "Balance Pending" + the Excel export understate what patients owe (they only count partially-paid visits). If the pending column matters to you, entries should also be written when `billed > 0`. Small code change but changes report semantics — your call.

**6. Deleted patient's collections stay, with their name.** ⚙️ Defensible (money history shouldn't vanish) but it contradicts the "all their records" promise and leaves dangling `patientId`s. Decide: keep-for-accounting (recommended; maybe tag "(removed patient)") or delete-with-patient.

**7. Two devices = silent data loss.** 🏗 Reception (desktop) and doctor (phone) both add a patient within the same minute → whole-list overwrite, one patient vanishes. Now that the site is live with **two real logins**, this is no longer theoretical. See Part 2.

### 🟡 Moderate / notes

**8. Role gating is client-side only.** The doctor-only Collections/History tabs are hidden from reception's *UI*, but the database allows any authenticated user to read/write everything — reception could see collections data via the browser console. Fine for a trusting 2-person clinic; real enforcement needs per-role RLS. 🏗
**9. `user_metadata` roles are self-editable.** A signed-in user can technically call the API to change their own role to doctor. Move roles to a `staff` table or `app_metadata` for tamper-proofing. ⚙️
**10. Actor name in the activity log is the free-typed staff-name box** — the log's "who" is honor-system even though login identity is now known. Easy improvement: stamp the signed-in email. ✅
**11. Collections capped at 3,000 entries, history at 500** — oldest entries silently drop, including unpaid balances from the Excel export. Export periodically; raise the cap if needed. ✅ (one number)
**12. Edited visits re-date their collections entry's `recordedAt`** to "now" (remove + re-add), so the entry jumps to the top as if just recorded. Cosmetic. ✅
**13. Failed activity/collections writes are silently ignored** (`catch {}`) — a payment row can be lost without any toast while the visit itself saved. ✅ (add a toast)
**14. No appointment delete** — cancelled appointments accumulate forever in `appointments-index`. Harmless for years at clinic scale; a "clear old cancelled" tidy-up can come later. 🟢

### What looks good
- Visit ↔ collections syncing (edit and delete) is done correctly via `visitId`.
- Rescheduling an appointment resets its "reminded" flag — thoughtful.
- Phone input now enforces 10 digits; Excel export is clean with a totals row and range validation.
- No XSS/injection exposure; the secret key is nowhere in the code; RLS is on.

### Verdict
**Request changes** — items 1–4 are patient-facing correctness bugs with small, tested fixes. Say the word and I'll apply all four to the code and you just `git push` (Vercel redeploys automatically).

---

# Part 2 — Architecture review

```
Doctor's phone ──┐                       ┌─ Auth (2 users, role in user_metadata)
                 ├── React SPA (Vercel) ─┤
Reception desk ──┘   whole-document      └─ Postgres: clinic_storage
                     read-modify-write        5 JSON documents (above)
```

### The core architectural fact
Every save is **read → modify in memory → write the whole document back**. There are no transactions, no per-record writes, no server-side logic. All integrity rules (propagation, cleanup, caps) live in client-side JavaScript — which is why a missed propagation becomes a data bug rather than being impossible by construction.

### Deletion semantics, precisely
- *Visit delete*: *cascades correctly* (patient record + collections by `visitId`).
- *Patient delete*: cascades to the index and record, **orphans appointments** (bug #2) and **strands collections** (decision #6). Nothing else references patients, so fixing those two closes the loop.
- *Appointment*: soft-state only (`status: cancelled`), never deleted — an intentional audit-friendly choice worth keeping.
- Nothing is recoverable after delete: there is no soft-delete, no undo, no backup. For patient data, "Remove patient" is the most dangerous button in the app — a doctor-only gate (done) plus a periodic export are the compensations.

### Concurrency: the one that will bite next
Two writers on the same document = last-write-wins, no detection, no merge. Risk ranking by document: `appointments-index` (both roles touch it daily) > `patients-index` > `collections-log` > `patient:<id>` (usually one editor per patient at a time). Incremental mitigation without a rewrite: split appointments into per-row `appointment:<id>` keys like patients already are — inserts stop colliding entirely; the remaining index collisions become rare. Full fix: real tables with row inserts (Postgres is *right there* under the JSON).

### Failure modes to know
- **Supabase free tier pauses after ~1 week idle** → the app loads with an empty-looking clinic (bug #4 makes this dangerous rather than just confusing). Restore from the dashboard; daily use prevents it.
- **No backups on free tier** → weekly export of `clinic_storage` (CSV from Table Editor) is your disaster-recovery plan. This is patient data: treat it as a schedule, not a suggestion.
- **Photos-in-JSON**: every prescription photo (~100 KB base64) rides inside the patient document; a long-history patient means multi-MB re-uploads on every small edit. Watch save times; the upgrade is Supabase Storage + path references.
- **No error telemetry**: production failures appear only as toasts on the user's screen. Supabase dashboard → Logs is your only server-side view.

### Recommended order of work
1. ✅ Apply bug fixes 1–4 (ready, tested — one push).
2. Decide #5 and #6 (report semantics) — then they're ✅ too.
3. Weekly export habit (or a scheduled backup job).
4. Per-row appointments (kills the worst concurrency risk).
5. Roles → `staff` table + per-role RLS (turns the doctor/reception divide from UI decoration into enforcement).
6. Photos → Supabase Storage. Real tables only if the clinic outgrows all of the above.
