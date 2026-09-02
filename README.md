# Perfect Smiles Clinic Portal

This turns the supplied Perfect Smiles dental ERP into a real website with:

- One shared clinic login
- Cloud-synced patient records
- Appointments
- WhatsApp appointment reminders
- Collections
- Treatment history
- Activity history
- Prescription photo upload/preview
- Mobile-friendly UI
- Sign out

## 1. Create the database

1. Create a project in Supabase.
2. Open **SQL Editor**.
3. Paste and run `supabase.sql`.
4. In **Authentication → Users**, create **two** email/password accounts — one for the doctor, one for reception.
5. For the doctor's account, click into it → **User Metadata** → add:
   ```json
   { "role": "doctor" }
   ```
   Leave the reception account's metadata blank (or set `{ "role": "reception" }`) — any account without `role: doctor` is treated as reception.
6. Disable public sign-ups so nobody can create an account from the website.

The doctor login sees all tabs, including Collections and History. The reception login does not see those two tabs at all.

## 2. Configure the website

Copy `.env.example` to `.env.local` and fill in:

```text
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

The anon key is intended for browser use; the database is protected by Row Level Security.

## 3. Run locally

```bash
npm install
npm run dev
```

Then open the Vite URL shown in the terminal.

## 4. Deploy

This project is ready for Vercel, Netlify or Cloudflare Pages.

Build command:

```bash
npm run build
```

Output directory:

```text
dist
```

Add the same two `VITE_` environment variables in the hosting provider.

## Important production note

The original supplied ERP stores prescription photos as compressed base64 inside the patient JSON. This version preserves that behaviour so the existing UI works immediately.

For a production dental/medical system, the next upgrade should move prescription images to **Supabase Storage** and keep only secure file paths in the database. It is also advisable to add individual staff accounts and permissions rather than sharing one password if more than one person will operate the clinic system.

The clinic login is intentionally not embedded in the code.

## Bug fixes applied (2026-08-30)

All four verified with automated browser tests before shipping (5/5 passing).

1. **Phone/name edits now propagate to appointments and collections.**
   Appointments keep a copy of the patient's name and phone for display and
   WhatsApp reminder links. Previously, editing a patient updated only their
   record — existing appointments kept the old number, so reminders went to
   the wrong phone. Saving a patient edit now rewrites that patient's
   appointments and their name in the collections log.

2. **Deleting a patient now removes their appointments too.**
   Previously the patient disappeared but their scheduled appointments stayed
   in Today/Reminders as "ghosts" with a working Send Reminder button. The
   delete now cleans up appointments by patientId, matching the confirm
   dialog's promise. (Their collections history is intentionally kept for
   accounting.)

3. **Dates are now computed in local time, not UTC.**
   "Today" used to flip at 5:30 AM IST, so early-morning entries were filed
   under yesterday — skewing the Today tab, the 3-day reminder window, Daily
   Collections totals and the Excel export. All date strings are now built
   from the clinic's local timezone.

4. **A connection failure no longer looks like an empty clinic.**
   If Supabase is unreachable (bad network, or a paused free-tier project),
   the app used to show "No patients yet" — inviting staff to re-enter
   patients as duplicates. It now shows a red warning banner ("Couldn't load
   clinic data — don't re-enter records") with a Retry button.
