import { getMatch } from '@/app/actions/matches'
import { getPlayerStats } from '@/app/actions/dashboard'
import { notFound } from 'next/navigation'
import ClientMatchPage from './ClientMatchPage'
import { Match, MatchPlayer, Player, Position, Foot, TeamColor } from '@/types'
import { Prisma } from '@prisma/client'

interface PageProps {
  params: { id: string }
}

type PrismaMatchWithPlayers = Prisma.MatchGetPayload<{
  include: { matchPlayers: { include: { player: true } } }
}>

// Maps Prisma string fields to our typed enums
function transformMatch(
  prismaMatch: PrismaMatchWithPlayers,
): Match & { matchPlayers: (MatchPlayer & { player: Player })[] } {
  return {
    ...prismaMatch,
    matchPlayers: prismaMatch.matchPlayers.map((mp) => ({
      ...mp,
      team: mp.team as TeamColor | null,
      player: {
        ...mp.player,
        primaryPosition: mp.player.primaryPosition as Position,
        secondaryPosition: mp.player.secondaryPosition as Position | null,
        foot: mp.player.foot as Foot | null,
      },
    })),
  }
}

export default async function MatchDetailPage({ params }: PageProps) {
  const prismaMatch = await getMatch(params.id)
  
  if (!prismaMatch) {
    notFound()
  }

  // Transform Prisma data to properly typed Match
  const match = transformMatch(prismaMatch)

  // Get player stats for available players
  const allPlayerStats = await getPlayerStats()
  const availablePlayerIds = match.matchPlayers
    .filter(mp => mp.isAvailable)
    .map(mp => mp.playerId)
  
  const availablePlayers = allPlayerStats.filter(p => availablePlayerIds.includes(p.id))

  return (
    <ClientMatchPage
      match={match}
      availablePlayers={availablePlayers}
      matchId={params.id}
    />
  )
}
