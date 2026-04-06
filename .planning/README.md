# Sunday League Manager - Project Overview

## Project Identity
**Name:** Sunday League Manager  
**Purpose:** A modern, professional team balancing and player tracking web application for casual football clubs (5-12 a side, including 11-a-side).  
**Core Value:** Enables football club organizers to efficiently manage their casual teams by automating team balancing, tracking player performance, and simplifying match day logistics.

## Target Users
- Football club organizers/captains managing 5-12 a side casual teams
- Players who want to track their performance stats
- WhatsApp group administrators who need easy squad exports

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** Prisma ORM with SQLite
- **Styling:** Tailwind CSS
- **Data Fetching:** Server Actions
- **Testing:** Vitest
- **Icons:** Lucide React
- **Charts:** Recharts

## Current Status: MVP Complete ✅

The application is already fully functional with:
- Complete database schema with migrations
- Working team balancing algorithm
- Full CRUD operations for players and matches
- Stats tracking and ratings calculation
- WhatsApp export functionality
- Mobile responsive design
- Test coverage for core algorithms

## Architecture Overview

### Database Schema (Prisma)
- **Player:** Core player data (name, positions, foot preference)
- **Match:** Match scheduling (date, opponent, side size)
- **MatchPlayer:** Junction table with availability, team assignment, and stats

### Key Algorithms
1. **Composite Rating System** (`lib/ratings.ts`)
   - Team GD: 30%
   - Attack/Defense stats per 90: 30%
   - MOTM index (position-adjusted): 25%
   - Availability rate: 15%

2. **Team Balancing Algorithm** (`lib/teamBalancer.ts`)
   - Greedy assignment based on ratings
   - Soft positional quotas (GK/DEF/MID/FWD)
   - Local search optimization with pairwise swaps

### File Structure
```
src/
├── app/
│   ├── actions/          # Server Actions
│   ├── api/              # API routes for client-side updates
│   ├── players/          # Player CRUD pages
│   ├── matches/          # Match management pages
│   ├── layout.tsx        # Root layout with Navigation
│   └── page.tsx          # Dashboard
├── components/           # React components
├── lib/
│   ├── prisma.ts         # Prisma client
│   ├── ratings.ts        # Rating calculations
│   └── teamBalancer.ts   # Team generation logic
└── types/
    └── index.ts          # TypeScript types

prisma/
├── schema.prisma         # Database schema
├── migrations/           # Database migrations
└── seed.ts               # Seed data

tests/
├── teamBalancer.test.ts  # Team balancing tests
└── ratings.test.ts       # Rating calculation tests
```

## Implemented Features

### ✅ Core Features
1. **Player Management**
   - Create, read, update, soft-delete players
   - Position tracking (primary/secondary)
   - Foot preference
   - WhatsApp name for exports

2. **Match Management**
   - Schedule matches with opponent and venue
   - Side size configuration (5-12 players)
   - Player availability tracking
   - Match completion status

3. **Team Balancing**
   - Automatic balanced team generation
   - Composite rating-based assignment
   - Positional balance enforcement
   - Bench player management
   - Balance percentage calculation

4. **Stats Tracking**
   - Goals, assists, defensive actions
   - MOTM voting
   - Minutes played
   - Team goal differential
   - Games played tracking

5. **Rating System**
   - Position-adjusted MOTM factors
   - Per-90 stat normalization
   - Composite rating calculation
   - New player baseline (50.0)

6. **WhatsApp Export**
   - Copy-to-clipboard team lists
   - Position indicators
   - WhatsApp name support

7. **Analytics Dashboard**
   - Total players/matches overview
   - Top scorers leaderboard
   - MOTM awards tracking
   - Highest rated players
   - Upcoming matches count

## Remaining Work

### 🎯 Phase 2: Enhancements
- [ ] Match result recording (scores)
- [ ] Player profile pages with detailed stats
- [ ] Match history and performance trends
- [ ] Data export (CSV/JSON)
- [ ] Player availability trends

### 🎯 Phase 3: Polish
- [ ] Dark mode support
- [ ] PWA capabilities
- [ ] Offline support
- [ ] Push notifications
- [ ] Admin roles/permissions

### 🎯 Phase 4: Scale
- [ ] Multiple club support
- [ ] Season management
- [ ] League standings
- [ ] Integration with external APIs

## Next Sprint Focus
See [sprints/current.md](./sprints/current.md) for immediate priorities.

## Key Decisions
See [decisions/](./decisions/) for architecture and design decisions.

## Commands
```bash
# Development
npm run dev              # Start development server
npm run lint             # Run ESLint

# Database
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run database migrations
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed database with test data

# Testing
npm run test             # Run Vitest tests
```
