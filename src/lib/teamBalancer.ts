/**
 * Team Balancing Algorithm for Sunday League
 * 
 * Generates balanced teams (White vs Black) from available players.
 * 
 * Algorithm:
 * 1. Sort players by composite rating (descending)
 * 2. Greedy assignment: assign each player to team with lower total rating
 *    while respecting soft positional quotas
 * 3. Local search: attempt pairwise swaps to improve balance
 * 
 * Constraints:
 * - Team size: 5-12 per side
 * - Balanced composite ratings
 * - Rough positional balance (GK/DEF/MID/FWD)
 */

import { Position, TeamColor, PlayerWithStats, BalancedTeams } from '@/types'

// Soft quotas for positional balance (minimum per team)
const POSITIONAL_QUOTAS: Record<Position, number> = {
  GK: 1,
  DEF: 2,
  MID: 2,
  FWD: 1,
}

interface TeamState {
  players: PlayerWithStats[]
  totalRating: number
  positions: Record<Position, number>
}

/**
 * Initialize empty team state
 */
function createTeamState(): TeamState {
  return {
    players: [],
    totalRating: 0,
    positions: {
      GK: 0,
      DEF: 0,
      MID: 0,
      FWD: 0,
    },
  }
}

/**
 * Add player to team
 */
function addPlayerToTeam(team: TeamState, player: PlayerWithStats): void {
  team.players.push(player)
  team.totalRating += player.compositeRating
  team.positions[player.primaryPosition]++
}

/**
 * Remove player from team
 */
function removePlayerFromTeam(team: TeamState, player: PlayerWithStats): void {
  const index = team.players.findIndex(p => p.id === player.id)
  if (index !== -1) {
    team.players.splice(index, 1)
    team.totalRating -= player.compositeRating
    team.positions[player.primaryPosition]--
  }
}

/**
 * Check if adding player violates soft positional quotas
 * Only checks if team is below minimum requirements
 */
function wouldViolateQuota(
  team: TeamState,
  otherTeam: TeamState,
  player: PlayerWithStats,
  targetSize: number
): boolean {
  // If team is already full, can't add
  if (team.players.length >= targetSize) {
    return true
  }

  // Check if this position is critically underrepresented
  const position = player.primaryPosition
  const teamCount = team.positions[position]
  const otherCount = otherTeam.positions[position]

  // If other team has more of this position and we have less than minimum,
  // we should prefer the other team (but not strictly enforce)
  if (teamCount < POSITIONAL_QUOTAS[position] && otherCount > teamCount) {
    // This is a soft constraint - we'll prefer the team with fewer
    // But won't block if the rating difference is significant
    const ratingDiff = Math.abs(team.totalRating - otherTeam.totalRating)
    if (ratingDiff < 10) {
      // Only apply soft constraint if teams are close in rating
      return true
    }
  }

  return false
}

/**
 * Greedy assignment phase
 * Assign players one by one to the team with lower total rating
 */
function greedyAssignment(
  sortedPlayers: PlayerWithStats[],
  targetSize: number
): { white: TeamState; black: TeamState } {
  const white = createTeamState()
  const black = createTeamState()

  for (const player of sortedPlayers) {
    // Determine which team to assign to
    const whiteRating = white.totalRating
    const blackRating = black.totalRating

    let assignToWhite: boolean

    if (white.players.length >= targetSize && black.players.length >= targetSize) {
      // Both teams full - shouldn't happen with proper input
      break
    } else if (white.players.length >= targetSize) {
      // Only black has space
      assignToWhite = false
    } else if (black.players.length >= targetSize) {
      // Only white has space
      assignToWhite = true
    } else {
      // Both have space - prefer team with lower rating
      // But check positional quotas
      const whiteWouldViolate = wouldViolateQuota(white, black, player, targetSize)
      const blackWouldViolate = wouldViolateQuota(black, white, player, targetSize)

      if (whiteWouldViolate && !blackWouldViolate) {
        assignToWhite = false
      } else if (blackWouldViolate && !whiteWouldViolate) {
        assignToWhite = true
      } else {
        // Neither or both would violate - go by rating
        assignToWhite = whiteRating <= blackRating
      }
    }

    if (assignToWhite) {
      addPlayerToTeam(white, player)
    } else {
      addPlayerToTeam(black, player)
    }
  }

  return { white, black }
}

/**
 * Local search improvement
 * Try swapping players between teams to improve balance
 */
function improveWithSwaps(
  white: TeamState,
  black: TeamState,
  maxIterations: number = 50
): void {
  const targetSize = white.players.length

  for (let i = 0; i < maxIterations; i++) {
    const whiteAvg = white.totalRating / white.players.length
    const blackAvg = black.totalRating / black.players.length

    // Find a player from the stronger team to swap
    const strongerTeam = whiteAvg > blackAvg ? white : black
    const weakerTeam = whiteAvg > blackAvg ? black : white

    let bestSwap: { fromStrong: PlayerWithStats; fromWeak: PlayerWithStats } | null = null
    let bestImprovement = 0

    // Try all possible swaps
    for (const strongPlayer of strongerTeam.players) {
      for (const weakPlayer of weakerTeam.players) {
        // Skip if same position (we want to maintain rough positional balance)
        // Actually, let's allow swaps if they improve balance without breaking quotas

        // Calculate rating change if we swap
        const newStrongRating = strongerTeam.totalRating - strongPlayer.compositeRating + weakPlayer.compositeRating
        const newWeakRating = weakerTeam.totalRating - weakPlayer.compositeRating + strongPlayer.compositeRating

        const newStrongAvg = newStrongRating / targetSize
        const newWeakAvg = newWeakRating / targetSize

        const currentDiff = Math.abs(whiteAvg - blackAvg)
        const newDiff = Math.abs(newStrongAvg - newWeakAvg)

        const improvement = currentDiff - newDiff

        // Check if swap maintains positional quotas
        const strongPositions = { ...strongerTeam.positions }
        const weakPositions = { ...weakerTeam.positions }

        strongPositions[strongPlayer.primaryPosition]--
        strongPositions[weakPlayer.primaryPosition]++
        weakPositions[weakPlayer.primaryPosition]--
        weakPositions[strongPlayer.primaryPosition]++

        const maintainsQuotas = Object.entries(POSITIONAL_QUOTAS).every(([pos, min]) => {
          return strongPositions[pos as Position] >= Math.min(min, 1) || 
                 weakPositions[pos as Position] >= Math.min(min, 1)
        })

        if (improvement > bestImprovement && maintainsQuotas) {
          bestImprovement = improvement
          bestSwap = { 
            fromStrong: strongPlayer, 
            fromWeak: weakPlayer 
          }
        }
      }
    }

    // Apply best swap if it improves things
    if (bestSwap && bestImprovement > 0.5) {
      removePlayerFromTeam(strongerTeam, bestSwap.fromStrong)
      removePlayerFromTeam(weakerTeam, bestSwap.fromWeak)
      addPlayerToTeam(strongerTeam, bestSwap.fromWeak)
      addPlayerToTeam(weakerTeam, bestSwap.fromStrong)
    } else {
      // No improving swap found
      break
    }
  }
}

/**
 * Generate balanced teams from available players
 * 
 * @param players - Array of available players with stats
 * @param sideSize - Target team size per side (5-12)
 * @returns Balanced teams result including bench players
 */
export function generateBalancedTeams(
  players: PlayerWithStats[],
  sideSize: number
): { teams: BalancedTeams; bench: PlayerWithStats[] } {
  // Validate input
  if (sideSize < 5 || sideSize > 12) {
    throw new Error('Team size must be between 5 and 12')
  }

  if (players.length < sideSize * 2) {
    throw new Error(`Need at least ${sideSize * 2} players to form teams`)
  }

  // Sort by composite rating descending
  const sortedPlayers = [...players].sort((a, b) => b.compositeRating - a.compositeRating)

  // Determine who makes the cut
  const playersForTeams = sortedPlayers.slice(0, sideSize * 2)
  const bench = sortedPlayers.slice(sideSize * 2)

  // Greedy assignment
  const { white, black } = greedyAssignment(playersForTeams, sideSize)

  // Local search improvement
  improveWithSwaps(white, black)

  // Calculate final metrics
  const whiteAvg = white.totalRating / white.players.length
  const blackAvg = black.totalRating / black.players.length
  const balancePercentage = Math.round((1 - Math.abs(whiteAvg - blackAvg) / Math.max(whiteAvg, blackAvg)) * 100)

  const teams: BalancedTeams = {
    white: white.players,
    black: black.players,
    whiteRating: Math.round(white.totalRating * 10) / 10,
    blackRating: Math.round(black.totalRating * 10) / 10,
    whiteAvgRating: Math.round(whiteAvg * 10) / 10,
    blackAvgRating: Math.round(blackAvg * 10) / 10,
    balancePercentage,
    whitePositions: white.positions,
    blackPositions: black.positions,
  }

  return { teams, bench }
}

/**
 * Export teams to clipboard-friendly format
 */
export function exportTeamsToText(
  teams: BalancedTeams,
  includePositions: boolean = true
): string {
  const formatPlayer = (player: PlayerWithStats) => {
    if (includePositions) {
      return `${player.name} (${player.primaryPosition})`
    }
    return player.whatsappName || player.name
  }

  const whiteLine = `White: ${teams.white.map(formatPlayer).join(', ')}`
  const blackLine = `Black: ${teams.black.map(formatPlayer).join(', ')}`

  return `${whiteLine}\n${blackLine}`
}
