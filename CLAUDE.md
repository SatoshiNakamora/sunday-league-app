# NSFN Sunday League App

This is the **NSFN Sunday League Manager** — a team balancing and player tracking web app for a casual 5-12 a side football club.

**Project path:** `/Users/emmanuelokonya/Documents/SundayLeague App/sunday-league-app/`

> NOTE: There's an unrelated Expense Tracker at `/Users/emmanuelokonya/Documents/NSFN Project NewAI/`. Always work on the Sunday League app unless told otherwise.

## Tech Stack

- **Framework:** Next.js 14 (App Router) + React 18 + TypeScript
- **Database:** SQLite via Prisma 5
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Testing:** Vitest
- **Icons:** Lucide React

## Commands

```bash
npm run dev          # Dev server (port 3000)
npm run build        # Production build
npm run lint         # ESLint
npm test             # Run all tests
npm test -- [name]   # Run specific test file
npm run db:migrate   # Run Prisma migrations
npm run db:studio    # Open Prisma Studio (database GUI)
npm run db:seed      # Seed the database
```

## Architecture

**Data Layer:** Prisma ORM with SQLite. Server Actions in `src/app/actions/` handle all CRUD operations.

**Core Domain Logic:**
- `src/lib/ratings.ts` — Player rating calculations using weighted composite: Team GD (30%), Attack/Defense per 90 (30%), MOTM Index (25%), Availability (15%)
- `src/lib/teamBalancer.ts` — Greedy assignment + local search optimization for balanced White vs Black teams
- `src/lib/validation.ts` — Input validation utilities

**Pages:**
- `/` — Dashboard with stats, top performers
- `/players` — Player management (CRUD)
- `/matches` — Match scheduling and management
- `/matches/[id]` — Match detail with tabs: Availability, Generate Teams, Match Stats

## Database Schema

- **Player:** id, name, whatsappName, primaryPosition, secondaryPosition, foot, isActive
- **Match:** id, date, opponent, pitchName, sideSize (5-12), isComplete
- **MatchPlayer:** join table with availability, team (WHITE/BLACK), stats (goals, assists, defensiveActions, motmVotes), teamGD

## Domain

- Players: name, position (GK/DEF/MID/FWD), availability, stats
- Matches: fixtures, scores, goalscorers, attendance, MOTM
- Team Balancing: automated lineup based on composite rating + positional quotas
- WhatsApp export for squad sharing

## Design System

**ALWAYS read DESIGN.md before making any visual or UI decisions.**

The app uses a **Retro-Futuristic Sports Brutalism** aesthetic:
- Neon cyan (#00ffff) as primary accent with dramatic glows
- Archivo Black (display) + Barlow Condensed (body) + JetBrains Mono (numbers)
- Brutalist clipped corners (polygon clip-path), never rounded
- Film grain + scanline overlays for retro CRT texture
- Scoreboard-style monospace numbers for all stats
- Dark-mode only (stadium night atmosphere)

All font choices, colors, spacing, visual effects, and component patterns are defined in DESIGN.md.

**Do not deviate without explicit user approval.**

In QA mode, flag any code that doesn't match DESIGN.md specifications.
