# Backlog

A mobile-first PWA for continuous task capture and urgency-based prioritization. Feeds your nightly paper time-blocking ritual.

## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase-migration.sql`
3. Go to **Authentication > Providers** and ensure Email auth is enabled
4. Copy your project URL and anon key from **Settings > API**

### 2. Environment

```bash
cp .env.example .env
```

Fill in your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run locally

```bash
npm install
npm run dev
```

### 4. Deploy to Vercel

1. Push to GitHub
2. Import the repo in Vercel
3. Add environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
4. Deploy

### 5. Install as PWA

On your phone, open the deployed URL in Safari (iOS) or Chrome (Android) and use "Add to Home Screen."

## Stack

- React + Vite
- Tailwind CSS
- Supabase (Postgres, Auth, Realtime)
- PWA (Service Worker, Manifest)
