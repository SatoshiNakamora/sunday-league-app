'use server'

import { prisma } from '@/lib/prisma'
import { PlayerWithStats, Position, Foot } from '@/types'
import { calculatePlayerRatings } from '@/lib/ratings'

export async function getPlayerStats(): Promise<PlayerWithStats[]> {
  // Get all active players
  const players = await prisma.player.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  })

  // Get total matches count for availability calculation
  const totalMatches = await prisma.match.count({
    where: { isComplete: true },
  })

  // Calculate stats for each player
  const playersWithStats = await Promise.all(
    players.map(async (player) => {
      // Get all match participation for this player
      const matchPlayers = await prisma.matchPlayer.findMany({
        where: {
          playerId: player.id,
          match: { isComplete: true },
        },
      })

      const gamesPlayed = matchPlayers.filter(mp => mp.played).length
      const goals = matchPlayers.reduce((sum, mp) => sum + mp.goals, 0)
      const assists = matchPlayers.reduce((sum, mp) => sum + mp.assists, 0)
      const defensiveActions = matchPlayers.reduce((sum, mp) => sum + mp.defensiveActions, 0)
      const motmCount = matchPlayers.filter(mp => mp.motmVotes > 0).length

      // Calculate average team GD
      const gdSum = matchPlayers
        .filter(mp => mp.played && mp.teamGD !== null)
        .reduce((sum, mp) => sum + (mp.teamGD || 0), 0)
      const avgTeamGD = gamesPlayed > 0 ? gdSum / gamesPlayed : 0

      return calculatePlayerRatings(
        {
          id: player.id,
          name: player.name,
          whatsappName: player.whatsappName,
          primaryPosition: player.primaryPosition as Position,
          secondaryPosition: player.secondaryPosition as Position | null,
          foot: player.foot as Foot | null,
          isActive: player.isActive,
          createdAt: player.createdAt,
          updatedAt: player.updatedAt,
        },
        {
          gamesPlayed,
          goals,
          assists,
          defensiveActions,
          motmCount,
          avgTeamGD,
        },
        totalMatches
      )
    })
  )

  return playersWithStats
}

export async function getDashboardStats() {
  const [
    totalPlayers,
    totalMatches,
    completedMatches,
    upcomingMatches,
  ] = await Promise.all([
    prisma.player.count({ where: { isActive: true } }),
    prisma.match.count(),
    prisma.match.count({ where: { isComplete: true } }),
    prisma.match.count({ 
      where: { 
        date: { gte: new Date() },
        isComplete: false,
      } 
    }),
  ])

  // Get top performers
  const playerStats = await getPlayerStats()
  const topScorers = [...playerStats]
    .filter(p => p.goals > 0)
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 5)
  
  const topMOTM = [...playerStats]
    .filter(p => p.motmCount > 0)
    .sort((a, b) => b.motmCount - a.motmCount)
    .slice(0, 5)

  const highestRated = [...playerStats]
    .sort((a, b) => b.compositeRating - a.compositeRating)
    .slice(0, 5)

  return {
    totalPlayers,
    totalMatches,
    completedMatches,
    upcomingMatches,
    topScorers,
    topMOTM,
    highestRated,
  }
}
