/**
 * Player rating calculation system for Sunday League team balancing
 * 
 * Composite rating formula weights:
 * - Team Goal Difference impact: 30%
 * - Goals + Assists + Defensive Actions per 90: 30%
 * - MOTM Index (votes per game, position-adjusted): 25%
 * - Availability Rate: 15%
 */

import { Position, Player, PlayerWithStats } from '@/types'

// Rating weights - easy to tweak
export const RATING_WEIGHTS = {
  TEAM_GD: 0.30,
  ATTACK_DEFENSE: 0.30,
  MOTM_INDEX: 0.25,
  AVAILABILITY: 0.15,
} as const

// Position factors to reduce attacker bias in MOTM
// GK and DEF get boost since they rarely win MOTM despite being crucial
export const POSITION_MOTM_FACTORS: Record<Position, number> = {
  GK: 1.5,  // Goalkeepers rarely get votes but are critical
  DEF: 1.3, // Defenders less likely to get votes
  MID: 1.0, // Baseline
  FWD: 0.8, // Forwards often get votes for just scoring
}

/**
 * Calculate availability rate as percentage
 * @param gamesPlayed - Number of games played
 * @param totalMatches - Total matches in the period
 * @returns Availability rate (0-1)
 */
export function calculateAvailabilityRate(
  gamesPlayed: number,
  totalMatches: number
): number {
  if (totalMatches === 0) return 1
  return Math.min(gamesPlayed / totalMatches, 1)
}

/**
 * Calculate MOTM index (votes per game, position-adjusted)
 * @param motmCount - Total MOTM votes received
 * @param gamesPlayed - Number of games played
 * @param position - Player's primary position
 * @returns Position-adjusted MOTM index
 */
export function calculateMOTMIndex(
  motmCount: number,
  gamesPlayed: number,
  position: Position
): number {
  if (gamesPlayed === 0) return 0
  const rawIndex = motmCount / gamesPlayed
  const positionFactor = POSITION_MOTM_FACTORS[position]
  return rawIndex * positionFactor
}

/**
 * Calculate stats per 90 minutes
 * @param stat - Raw stat count (goals, assists, defensive actions)
 * @param minutesPlayed - Total minutes played
 * @returns Stat per 90 minutes
 */
export function calculatePer90(stat: number, minutesPlayed: number): number {
  if (minutesPlayed === 0) return 0
  return (stat * 90) / minutesPlayed
}

/**
 * Calculate composite rating for a player
 * @param player - Player with aggregated stats
 * @returns Composite rating score (0-100 scale roughly)
 */
export function calculateCompositeRating(player: PlayerWithStats): number {
  const { gamesPlayed, goals, assists, defensiveActions, motmCount, availabilityRate, avgTeamGD } = player
  
  if (gamesPlayed === 0) {
    // New players get a neutral baseline rating
    return 50
  }

  // Calculate total minutes (assume 90 per game if not tracked)
  const totalMinutes = gamesPlayed * 90

  // 1. Team Goal Difference component (-5 to +5 GD range normalized to 0-100)
  // Shift GD by +5 to make it positive, then scale
  const gdComponent = ((avgTeamGD + 5) / 10) * 100
  const gdScore = Math.max(0, Math.min(100, gdComponent))

  // 2. Attack/Defense contribution per 90
  // Normalize: assume max 2 goals + 2 assists + 5 defensive actions per 90 is "excellent" (100)
  const goalsPer90 = calculatePer90(goals, totalMinutes)
  const assistsPer90 = calculatePer90(assists, totalMinutes)
  const defActionsPer90 = calculatePer90(defensiveActions, totalMinutes)
  const totalContribution = goalsPer90 + assistsPer90 + defActionsPer90
  const contributionScore = Math.min(100, (totalContribution / 9) * 100)

  // 3. MOTM Index (0-1 range, scaled to 0-100)
  const motmIndex = calculateMOTMIndex(motmCount, gamesPlayed, player.primaryPosition)
  const motmScore = Math.min(100, motmIndex * 100)

  // 4. Availability (already 0-1, scale to 0-100)
  const availabilityScore = availabilityRate * 100

  // Weighted composite
  const compositeRating =
    gdScore * RATING_WEIGHTS.TEAM_GD +
    contributionScore * RATING_WEIGHTS.ATTACK_DEFENSE +
    motmScore * RATING_WEIGHTS.MOTM_INDEX +
    availabilityScore * RATING_WEIGHTS.AVAILABILITY

  return Math.round(compositeRating * 10) / 10 // Round to 1 decimal
}

/**
 * Calculate all ratings for a player
 * @param player - Base player data
 * @param stats - Aggregated stats from match history
 * @param totalMatches - Total matches in the system
 * @returns Player with calculated ratings
 */
export function calculatePlayerRatings(
  player: Player,
  stats: {
    gamesPlayed: number
    goals: number
    assists: number
    defensiveActions: number
    motmCount: number
    avgTeamGD: number
  },
  totalMatches: number
): PlayerWithStats {
  const availabilityRate = calculateAvailabilityRate(stats.gamesPlayed, totalMatches)
  const motmIndex = calculateMOTMIndex(stats.motmCount, stats.gamesPlayed, player.primaryPosition)
  
  const playerWithStats: PlayerWithStats = {
    ...player,
    ...stats,
    availabilityRate,
    motmIndex,
    compositeRating: 0, // Will be calculated next
  }

  playerWithStats.compositeRating = calculateCompositeRating(playerWithStats)

  return playerWithStats
}
