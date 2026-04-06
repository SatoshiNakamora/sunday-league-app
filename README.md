# Sunday League Manager

A modern, professional team balancing and player tracking web application for casual football clubs (5-12 a side, including 11-a-side).

## Features

- **Player Management**: Create, edit, and manage player profiles with positions and stats
- **Match Management**: Schedule matches, track availability, and manage squads
- **Team Balancing Algorithm**: Automatically generate balanced White vs Black teams
- **Stats Tracking**: Record goals, assists, defensive actions, and MOTM votes
- **WhatsApp Export**: Copy formatted squads for easy sharing
- **Analytics Dashboard**: View top performers, ratings, and club statistics
- **Mobile Responsive**: Fully usable on mobile devices for pitch-side management

## Tech Stack

- **Next.js 14** - Full-stack React framework with App Router
- **TypeScript** - Type-safe development
- **Prisma** - Database ORM with SQLite
- **Tailwind CSS** - Modern styling
- **Server Actions** - Modern data mutations

## Quick Start

### 1. Install Dependencies

```bash
cd sunday-league-app
npm install
```

### 2. Setup Database

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed with sample data
npm run db:seed
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── actions/           # Server Actions for CRUD
│   ├── api/               # API routes
│   ├── players/           # Player pages
│   ├── matches/           # Match pages
│   ├── page.tsx           # Dashboard
│   └── layout.tsx         # Root layout
├── components/            # React components
├── lib/                   # Core utilities
│   ├── prisma.ts         # Database client
│   ├── ratings.ts        # Rating calculations
│   └── teamBalancer.ts   # Team balancing algorithm
├── types/                 # TypeScript types
└── app/globals.css       # Global styles
```

## Usage Guide

### 1. Add Players

Go to **Players** → **Add Player** to create player profiles with:
- Name and WhatsApp display name
- Primary and secondary positions (GK/DEF/MID/FWD)
- Preferred foot

### 2. Schedule a Match

Go to **Matches** → **New Match** to:
- Set date, opponent, and venue
- Choose team size (5v5 to 12v12)
- Select available players

### 3. Mark Availability

On the match detail page, use the **Availability** tab to toggle which players are available.

### 4. Generate Balanced Teams

Switch to the **Generate Teams** tab:
- Select team size (can be different from match setting)
- Click "Generate Teams"
- View team balance score and positional breakdown
- Copy to clipboard for WhatsApp sharing

### 5. Enter Match Stats

After the match, use the **Match Stats** tab to record:
- Who played and which team they were on
- Goals, assists, and defensive actions
- MOTM votes

### 6. View Analytics

The **Dashboard** shows:
- Total players, matches, and upcoming fixtures
- Top scorers, MOTM winners, and highest-rated players

## Team Balancing Algorithm

The app uses a composite rating system to balance teams:

### Composite Rating Formula
- **Team Goal Difference** (30%): Average GD when player plays
- **Attack/Defense Contribution** (30%): Goals + Assists + Defensive actions per 90
- **MOTM Index** (25%): Position-adjusted votes per game
- **Availability Rate** (15%): Percentage of games attended

### Position MOTM Factors
To reduce attacker bias, MOTM votes are weighted:
- **GK**: 1.5x (boosted)
- **DEF**: 1.3x (boosted)
- **MID**: 1.0x (baseline)
- **FWD**: 0.8x (reduced)

### Algorithm Steps
1. Sort players by composite rating (descending)
2. Greedy assignment: assign to team with lower total rating
3. Respect soft positional quotas (at least 1 GK, balanced DEF/MID/FWD)
4. Local search: attempt pairwise swaps to improve balance

## Testing

Run the test suite:

```bash
npm test
```

Tests cover:
- Rating calculations
- Team balancing algorithm edge cases
- Position balance constraints

## Database Schema

### Player
- `id`, `name`, `whatsappName`
- `primaryPosition`, `secondaryPosition`, `foot`
- `isActive` (soft delete)

### Match
- `id`, `date`, `opponent`, `pitchName`
- `sideSize` (5-12)
- `isComplete`

### MatchPlayer (Join Table)
- `matchId`, `playerId`
- `isAvailable`, `played`, `team` (WHITE/BLACK)
- `minutes`, `goals`, `assists`, `defensiveActions`
- `motmVotes`, `teamGD`

## Customization

### Tweak Rating Weights

Edit `src/lib/ratings.ts`:

```typescript
export const RATING_WEIGHTS = {
  TEAM_GD: 0.30,        // Adjust as needed
  ATTACK_DEFENSE: 0.30,
  MOTM_INDEX: 0.25,
  AVAILABILITY: 0.15,
}
```

### Adjust MOTM Position Factors

```typescript
export const POSITION_MOTM_FACTORS: Record<Position, number> = {
  GK: 1.5,   // Increase to boost GKs further
  DEF: 1.3,
  MID: 1.0,
  FWD: 0.8,
}
```

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Note: SQLite is used for simplicity. For production with multiple users, consider migrating to PostgreSQL.

## License

MIT - Built for Sunday League football clubs everywhere.

## Support

For issues or feature requests, please create an issue in the repository.
