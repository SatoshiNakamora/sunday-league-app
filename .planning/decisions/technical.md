# Technical Decisions

## ADR-001: SQLite for Single-Club Deployment
**Status:** Accepted  
**Date:** Feb 2026

### Context
Need a database that requires minimal setup for a single-club deployment scenario.

### Decision
Use SQLite with Prisma ORM. This eliminates the need for separate database server setup.

### Consequences
- ✅ Zero-config deployment
- ✅ Single file database easy to backup
- ✅ Prisma migration support
- ❌ Not suitable for concurrent writes (acceptable for single-admin use)
- ❌ Limited horizontal scaling (not needed for MVP)

### Migration Path
Can easily migrate to PostgreSQL later by changing the datasource URL and running migrations.

---

## ADR-002: Server Actions for Data Mutations
**Status:** Accepted  
**Date:** Feb 2026

### Context
Next.js 14 App Router with need for server-side data operations without complex API route boilerplate.

### Decision
Use Next.js Server Actions for all CRUD operations instead of separate API routes.

### Consequences
- ✅ Reduced boilerplate vs API routes
- ✅ Type-safe function calls from components
- ✅ Automatic revalidation with `revalidatePath`
- ✅ Built-in progressive enhancement
- ❌ Learning curve for new developers
- ❌ Debugging can be more complex

### Exceptions
Using traditional API routes for:
- Real-time updates during match stats entry (ClientMatchPage uses API for immediate feedback)
- Future webhook integrations

---

## ADR-003: Composite Rating Formula
**Status:** Accepted  
**Date:** Feb 2026

### Context
Need an objective way to rate players for team balancing that accounts for different positions and contributions.

### Decision
Four-factor weighted formula:
- Team GD impact: 30%
- Goals+Assists+Defense per 90: 30%
- MOTM index (position-adjusted): 25%
- Availability rate: 15%

### Rationale
- Team GD captures overall impact on winning
- Per-90 stats normalize for playing time
- Position-adjusted MOTM reduces forward bias
- Availability rewards commitment

### Position MOTM Factors
- GK: 1.5x (rarely get votes but critical)
- DEF: 1.3x (underappreciated)
- MID: 1.0x (baseline)
- FWD: 0.8x (often get votes for scoring)

---

## ADR-004: Soft Deletes for Players
**Status:** Accepted  
**Date:** Feb 2026

### Context
Players may leave and return. Need to preserve historical stats while hiding inactive players from current selection.

### Decision
Implement soft deletes using `isActive` boolean flag instead of hard deletes.

### Consequences
- ✅ Preserves match history integrity
- ✅ Easy to reactivate players
- ✅ Stats remain accurate over time
- ❌ Requires filtering `isActive: true` in most queries
- ❌ Data retention of inactive players

---

## ADR-005: Local Search for Team Balancing
**Status:** Accepted  
**Date:** Feb 2026

### Context
Need an algorithm that balances teams fairly while respecting positional constraints.

### Decision
Two-phase algorithm:
1. Greedy assignment (sort by rating, assign to weaker team)
2. Local search (pairwise swaps to improve balance)

### Why Not Optimal?
Finding perfectly optimal team balance is NP-hard. Local search provides "good enough" results quickly (max 50 iterations).

### Trade-offs
- ✅ Fast execution (<100ms for 20 players)
- ✅ Respects positional quotas
- ✅ Easy to understand and debug
- ❌ May not find global optimum
- ❌ Results can vary based on player order

---

## ADR-006: TypeScript Strict Mode
**Status:** Accepted  
**Date:** Feb 2026

### Context
Want to maximize type safety and catch errors at compile time.

### Decision
Enable TypeScript strict mode with strict null checks.

### Consequences
- ✅ Catches null/undefined errors
- ✅ Better IDE autocomplete
- ✅ Self-documenting code
- ❌ More verbose type annotations
- ❌ Initial setup takes longer

---

## ADR-007: Vitest for Testing
**Status:** Accepted  
**Date:** Feb 2026

### Context
Need a testing framework that works well with TypeScript and has fast execution.

### Decision
Use Vitest instead of Jest for its native ESM support and faster execution.

### Consequences
- ✅ Native ESM support (no transpilation)
- ✅ Fast watch mode
- ✅ Compatible with Jest API
- ❌ Smaller ecosystem than Jest
- ❌ Some plugins may not be available
