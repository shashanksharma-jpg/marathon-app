# shashank.app — Deployment Guide

Personal apps platform deployed at **shashank.app** via Vercel + Supabase.

---

## Project Structure

```
shashank-app/
├── app/
│   ├── layout.jsx          ← Root layout (shared across all apps)
│   ├── page.jsx            ← Home page — shashank.app
│   ├── globals.css         ← Global CSS reset
│   └── marathon/
│       └── page.jsx        ← Marathon Coach App → shashank.app/marathon
├── lib/
│   └── supabase.js         ← Supabase client + loadState/saveState helpers
├── supabase-setup.sql      ← Run once in Supabase SQL editor
├── vercel.json             ← Vercel config
├── next.config.js          ← Next.js config
├── package.json
├── tsconfig.json
├── .env.example            ← Copy to .env.local and fill in your keys
└── .gitignore
```

---

## Step 1 — Supabase Setup (~5 minutes)

1. Go to **[supabase.com](https://supabase.com)** → "Start your project" → sign in with GitHub
2. Click **"New project"**
   - Name: `shashank-app`
   - Database password: generate a strong one and save it
   - Region: pick **Southeast Asia (Singapore)** — closest to you
3. Wait ~2 minutes for the project to spin up
4. Go to **SQL Editor** (left sidebar) → **New query**
5. Paste the contents of `supabase-setup.sql` → click **Run**
6. Go to **Settings → API** and copy:
   - **Project URL** → `https://xxxxx.supabase.co`
   - **anon public key** → long string starting with `eyJ...`

---

## Step 2 — GitHub Setup (~3 minutes)

1. Go to **[github.com/new](https://github.com/new)**
2. Create a repo called `shashank-app` (private is fine)
3. Upload all files from this folder (drag and drop in the GitHub UI, or use git)

   ```bash
   git init
   git add .
   git commit -m "initial commit — shashank.app"
   git remote add origin https://github.com/YOUR_USERNAME/shashank-app.git
   git push -u origin main
   ```

---

## Step 3 — Vercel Deploy (~3 minutes)

1. Go to **[vercel.com/new](https://vercel.com/new)** → "Import Git Repository"
2. Connect your GitHub account → select `shashank-app`
3. Before clicking Deploy, go to **Environment Variables** and add:

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...your anon key...` |

4. Click **Deploy** — Vercel builds and deploys in ~60 seconds
5. You'll get a URL like `shashank-app-xyz.vercel.app` — the app is live ✅

---

## Step 4 — Connect shashank.app Domain (~5 minutes)

1. In your **Vercel dashboard** → select your project → **Settings → Domains**
2. Click **"Add Domain"** → type `shashank.app` → click Add
3. Also add `www.shashank.app` → Vercel will suggest redirecting www → root (accept this)
4. Vercel shows you DNS records to add. Go to wherever you bought the domain:

   **Add these DNS records at your domain registrar:**

   | Type | Name | Value |
   |------|------|-------|
   | `A` | `@` | `76.76.21.21` |
   | `CNAME` | `www` | `cname.vercel-dns.com` |

5. DNS propagates in 5–30 minutes. Vercel auto-provisions an SSL certificate.
6. Visit **shashank.app** — it's live with HTTPS 🚀

---

## Step 5 — Add to Home Screen (iPhone)

1. Open **shashank.app/marathon** in **Safari**
2. Tap the Share icon → **"Add to Home Screen"**
3. Name it "Marathon" → Add
4. Works like a native app, full screen, offline-capable ✅

---

## Adding Future Apps

Each new app is just a new folder inside `app/`:

```
app/
├── marathon/page.jsx    ← shashank.app/marathon  ✅ live
├── finance/page.jsx     ← shashank.app/finance   (future)
├── travel/page.jsx      ← shashank.app/travel    (future)
└── family/page.jsx      ← shashank.app/family    (future)
```

Then add it to the `APPS` array in `app/page.jsx` and Vercel redeploys automatically.

---

## Updating the Marathon App

Whenever Claude gives you an updated `marathon-coach-app.jsx`:
1. Open your GitHub repo → `app/marathon/page.jsx` → click ✏️ Edit
2. Paste the new code (keep the `"use client"` line and the Supabase import at the top)
3. Commit → Vercel auto-redeploys in ~30 seconds ✅

---

## Environment Variables Reference

| Variable | Where to find it |
|----------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon/public key |

Never commit `.env.local` to GitHub — it's in `.gitignore` ✅

---

## Authentication — NextAuth + Google OAuth

### How it works
- Every page of `shashank.app` is protected by `middleware.js`
- Visitors are redirected to `/auth/signin` and must sign in with Google
- Only email addresses in the `ALLOWED_EMAILS` array in `app/api/auth/[...nextauth]/route.js` can access the app
- Anyone else sees "This account doesn't have access"

### Adding/removing users
Open `app/api/auth/[...nextauth]/route.js` and edit the `ALLOWED_EMAILS` array:
```js
const ALLOWED_EMAILS = [
  "shashank.sharma@gmail.com",
  "aditi@gmail.com",  // add Aditi
];
```
Commit to GitHub → Vercel redeploys in ~30 sec.

---

## Step 1b — Google Cloud Console Setup (~10 minutes)

Before deploying, you need a Google OAuth Client ID and Secret.

1. Go to **[console.cloud.google.com](https://console.cloud.google.com)**
2. Click the project dropdown (top left) → **"New Project"** → name it `shashank-app` → Create
3. Wait ~30 seconds for the project to be created, then select it
4. Left sidebar → **"APIs & Services"** → **"OAuth consent screen"**
   - User Type: **External** → Create
   - App name: `shashank.app`
   - User support email: your Gmail
   - Developer contact email: your Gmail
   - Click **Save and Continue** through all steps (no scopes needed)
   - **Publishing status: Leave as "Testing"** — add your Gmail as a test user
5. Left sidebar → **"Credentials"** → **"+ Create Credentials"** → **"OAuth 2.0 Client ID"**
   - Application type: **Web application**
   - Name: `shashank.app`
   - Authorised JavaScript origins: `https://shashank.app`
   - Authorised redirect URIs: `https://shashank.app/api/auth/callback/google`
   - Click **Create**
6. Copy the **Client ID** and **Client Secret** — you'll need these in Vercel

### Vercel Environment Variables (5 total)

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | From Supabase Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From Supabase Settings → API |
| `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` in terminal |
| `NEXTAUTH_URL` | `https://shashank.app` |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |

### Testing locally
```bash
npm install
cp .env.example .env.local
# fill in your values in .env.local
npm run dev
# visit http://localhost:3000
```
For local testing, also add `http://localhost:3000` and `http://localhost:3000/api/auth/callback/google` to the Authorised origins/URIs in Google Cloud Console.
