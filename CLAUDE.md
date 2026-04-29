# Backlog — Project Context
# Place at: backlog/CLAUDE.md (project root)
# This file is read automatically at the start of every Claude Code session
# in this folder. The global CLAUDE.md (coding behavior + design philosophy)
# is also loaded. DESIGN.md in this folder is read before any UI work.

---

## What This Is

A mobile-first Progressive Web App (PWA) called "Backlog."
A personal to-do list tool for one user (CJ). Tasks are captured on the go
throughout the day and auto-sorted by urgency. The app feeds a nightly
analog time-blocking ritual — CJ opens it each evening, sees what's most
urgent, and pulls items onto a paper hourly schedule.

This is not a collaborative tool. No multi-user. No sharing. Single person.

---

## The User's Workflow

- Throughout the day: captures tasks the moment they come up (phone, quick add)
- Every night: opens Backlog, reviews the prioritized list, hand-writes
  tomorrow's time blocks on paper
- The app replaces a monthly journal brain-dump with continuous capture

---

## Core Features

**Quick Add** — persistent bar at the top. Tap, type, submit. Instant.
Optional expansion for: deadline (date picker), "promised to" (person's name),
context note (why it matters). These are all optional — capture speed is the
priority.

**Backlog Dashboard (Active tab)** — full list of active tasks, auto-sorted
by urgency. Each card shows: task name, urgency tag (colored, with reasoning),
optional context note. Tap card to edit inline. Done/Delete actions on each
card.

**Urgency Sorting Logic** (in `src/lib/urgency.js`):
1. Overdue (red)
2. Due today (red)
3. Due tomorrow (orange)
4. Committed to someone + deadline soon (orange)
5. Committed to someone + no deadline, aging (orange → yellow with age)
6. Due this week (yellow)
7. Further deadlines (grey)
8. No deadline, no commitment (grey, newest first)

**Done Tab** — completed tasks grouped by: Today, Yesterday, This Week, Older.
Strikethrough style. Satisfaction of seeing progress.

---

## Tech Stack

- **Framework**: React + Vite
- **Styling**: Tailwind CSS (v4 with @tailwindcss/vite plugin)
- **Database**: Supabase (Postgres + Row Level Security + Realtime)
- **Auth**: Supabase Auth (email/password)
- **Deploy**: Vercel (connected to GitHub repo: carluchio/backlog)
- **PWA**: Service worker + manifest.json (installable on iOS/Android)

---

## File Structure

```
backlog/
├── src/
│   ├── components/
│   │   ├── AuthForm.jsx       # Login/signup screen
│   │   ├── BacklogList.jsx    # Active tasks list
│   │   ├── CompletedList.jsx  # Done tab, grouped by date
│   │   ├── QuickAdd.jsx       # Persistent add bar + expanded fields
│   │   ├── TaskCard.jsx       # Individual task card with edit/done/delete
│   │   └── UrgencyTag.jsx     # Colored urgency label component
│   ├── hooks/
│   │   ├── useAuth.js         # Supabase auth state
│   │   └── useTasks.js        # CRUD + realtime subscription
│   ├── lib/
│   │   ├── supabase.js        # Supabase client init
│   │   └── urgency.js         # Urgency scoring + sort logic
│   ├── App.jsx                # Root layout, auth gate, tab switching
│   ├── main.jsx               # Entry point + service worker registration
│   └── index.css              # Tailwind imports + CSS variables
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker (cache-first shell)
│   ├── icon-192.png
│   └── icon-512.png
├── index.html                 # PWA meta tags, font loading
├── vite.config.js
├── supabase-migration.sql     # Run once in Supabase SQL editor
├── .env.example               # VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
├── CLAUDE.md                  # This file
└── DESIGN.md                  # Full UI/UX reference — read before any UI work
```

---

## Design Direction

The aesthetic is: **dark, dense, functional** — like a fitness tracking app
(Strong, Hevy, Whoop). Information-rich without clutter. Feels like a tool
built for someone serious, not a pastel consumer app.

- Background: deep charcoal (`#0A0A0C`)
- Surface stack: `#141418` → `#1C1C22` → `#2A2A32`
- Accent: electric blue (`#3B82F6`)
- Font: DM Sans (current) — keep unless redesigning
- Urgency colors: red (`#EF4444`), orange (`#F97316`), yellow (`#EAB308`),
  grey (`#6B7280`)
- Dark, minimal, no decorative elements
- Always read DESIGN.md before making any visual changes

---

## Supabase Schema

```sql
tasks (
  id uuid primary key,
  user_id uuid references auth.users,
  title text not null,
  deadline timestamptz,
  committed_to text,
  context_note text,
  status text ('active' | 'completed' | 'deleted'),
  completed_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz
)
```

Row Level Security is enabled. Users can only access their own tasks.
Realtime is enabled on the tasks table.

---

## Important Rules for This Project

- Always use CSS variables for colors — never hardcode hex values inline
- Optimistic UI updates — update state immediately, sync to Supabase in
  background. If sync fails, revert and show a toast.
- Mobile-first — test every change at 390px mentally before anything else
- The quick-add bar must always feel instant. Never add loading states to it.
- Touch targets minimum 44×44px on all interactive elements
- After making changes, ask before pushing to GitHub — never auto-push
- Supabase realtime subscription is already wired up in useTasks.js —
  don't remove or duplicate it

---

## Environment Variables

```
VITE_SUPABASE_URL=https://olesscpferoeloijoodd.supabase.co
VITE_SUPABASE_ANON_KEY=[stored in Vercel — ask CJ if needed locally]
```

---

## Deployment

GitHub repo: `carluchio/backlog`
Vercel project: `backlog-psi.vercel.app`
Every push to `main` triggers automatic redeploy on Vercel.
