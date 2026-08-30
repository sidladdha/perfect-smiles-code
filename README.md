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
