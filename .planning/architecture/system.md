# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Browser                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Dashboard   │  │  Player Mgmt │  │  Match Mgmt  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                    Next.js 14 App                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                 Server Components                       │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌────────────────────┐│ │
│  │  │ Server      │ │ Server      │ │ API Routes         ││ │
│  │  │ Actions     │ │ Components  │ │ (limited use)      ││ │
│  │  └─────────────┘ └─────────────┘ └────────────────────┘│ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                 Client Components                       │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌────────────────────┐│ │
│  │  │ Forms       │ │ Interactive │ │ WhatsApp Export    ││ │
│  │  │             │ │ Team Balancer│ │ Button            ││ │
│  │  └─────────────┘ └─────────────┘ └────────────────────┘│ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                    Prisma ORM                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Player Model   │   Match Model   │  MatchPlayer Model │ │
│  │  ├─ CRUD Ops    │   ├─ Scheduling │  ├─ Availability   │ │
│  │  ├─ Soft Delete │   ├─ Team Gen   │  ├─ Stats          │ │
│  │  └─ Stats Agg   │   └─ Completion │  └─ Ratings        │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                    SQLite Database                          │
│              (prisma/dev.db)                                │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

### Server Components (Default)
- `layout.tsx` - Root layout with Navigation
- `page.tsx` - Dashboard (async data fetching)
- `players/page.tsx` - Player list
- `players/new/page.tsx` - Create player form
- `matches/page.tsx` - Match list
- `matches/new/page.tsx` - Create match form
- `matches/[id]/page.tsx` - Match detail (server-rendered shell)

### Client Components ('use client')
- `matches/[id]/ClientMatchPage.tsx` - Interactive match management
  - Availability toggles
  - Team generation trigger
  - Stats input forms
  - WhatsApp export

## Data Flow

### 1. Player Creation Flow
```
User Input → Form Submission → Server Action (createPlayer)
                                    ↓
                              Prisma Create
                                    ↓
                              revalidatePath('/players')
                                    ↓
                              Client Refresh → Updated List
```

### 2. Team Balancing Flow
```
Available Players → getPlayerStats() → calculateCompositeRating()
                                            ↓
                              generateBalancedTeams()
                              ├─ greedyAssignment()
                              └─ improveWithSwaps()
                                            ↓
                              Display Teams + Bench
                                            ↓
                              Copy to Clipboard (WhatsApp)
```

### 3. Stats Recording Flow
```
Match Complete → Client Form Input
                      ↓
              API POST /api/matches/[id]/stats
                      ↓
              saveMatchStats() Server Action
                      ↓
              Prisma Bulk Update
                      ↓
              completeMatch() → Mark as Complete
```

## Algorithm Details

### Team Balancer Algorithm

**Phase 1: Greedy Assignment**
```typescript
1. Sort players by compositeRating (descending)
2. For each player:
   a. Check positional quotas (soft constraint)
   b. Assign to team with lower total rating
   c. Respect team size limits
```

**Phase 2: Local Search Optimization**
```typescript
1. For up to 50 iterations:
   a. Calculate current team averages
   b. Identify stronger and weaker team
   c. Try all possible player swaps between teams
   d. If swap improves balance AND maintains quotas:
      - Apply swap
      - Continue to next iteration
   e. Else: break (optimal found)
```

**Complexity:** O(n² × iterations) where n = players per team

### Rating Calculation Algorithm

**Components:**
```
Composite Rating = 
  (TeamGD_Score × 0.30) +
  (Contribution_Score × 0.30) +
  (MOTM_Score × 0.25) +
  (Availability_Score × 0.15)
```

**Position-Adjusted MOTM:**
```
MOTM_Index = (MOTM_Votes / Games_Played) × Position_Factor

Factors:
- GK:  1.5x
- DEF: 1.3x
- MID: 1.0x
- FWD: 0.8x
```

## Database Schema

```prisma
Player {
  id, name, whatsappName
  primaryPosition, secondaryPosition
  foot, isActive
  matchPlayers[] → MatchPlayer
}

Match {
  id, date, opponent, pitchName
  sideSize, isComplete
  matchPlayers[] → MatchPlayer
}

MatchPlayer {
  id, matchId, playerId
  isAvailable, played, team
  minutes, goals, assists
  defensiveActions, motmVotes, teamGD
  match → Match, player → Player
}
```

## Key Files Reference

| Purpose | File Path |
|---------|-----------|
| Rating Logic | `src/lib/ratings.ts` |
| Team Balancing | `src/lib/teamBalancer.ts` |
| Player Actions | `src/app/actions/players.ts` |
| Match Actions | `src/app/actions/matches.ts` |
| Dashboard Stats | `src/app/actions/dashboard.ts` |
| Types | `src/types/index.ts` |
| Database Schema | `prisma/schema.prisma` |

## Performance Considerations

1. **Query Optimization:**
   - Dashboard uses `Promise.all()` for parallel queries
   - Player stats calculated on-demand (not stored)
   - Proper Prisma indexing on foreign keys

2. **Caching Strategy:**
   - Next.js automatic static optimization
   - `revalidatePath` for cache invalidation
   - No client-side state management needed (Server Actions)

3. **Bundle Size:**
   - Tree-shaking with ES modules
   - Lucide icons (tree-shakeable)
   - Tailwind purges unused styles
