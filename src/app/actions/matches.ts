'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { validateMatchData as _validateMatchData } from '@/lib/validation'

// Match Actions
export async function getMatches() {
  return prisma.match.findMany({
    orderBy: { date: 'desc' },
    include: {
      matchPlayers: {
        include: {
          player: true,
        },
      },
    },
  })
}

export async function getUpcomingMatches() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return prisma.match.findMany({
    where: {
      date: { gte: today },
      isComplete: false,
    },
    orderBy: { date: 'asc' },
    include: {
      matchPlayers: {
        include: {
          player: true,
        },
      },
    },
  })
}

export async function getMatch(id: string) {
  return prisma.match.findUnique({
    where: { id },
    include: {
      matchPlayers: {
        include: {
          player: true,
        },
        orderBy: {
          player: {
            name: 'asc',
          },
        },
      },
    },
  })
}

export async function createMatch(data: {
  date: Date
  opponent: string
  pitchName?: string
  sideSize: number
  playerIds: string[]
}) {
  _validateMatchData(data)
  const match = await prisma.match.create({
    data: {
      date: data.date,
      opponent: data.opponent,
      pitchName: data.pitchName || null,
      sideSize: data.sideSize,
      matchPlayers: {
        create: data.playerIds.map(playerId => ({
          playerId,
          isAvailable: true,
        })),
      },
    },
    include: {
      matchPlayers: {
        include: {
          player: true,
        },
      },
    },
  })
  revalidatePath('/matches')
  return match
}

export async function updateMatch(
  id: string,
  data: {
    date?: Date
    opponent?: string
    pitchName?: string
    sideSize?: number
  }
) {
  const match = await prisma.match.update({
    where: { id },
    data: {
      date: data.date,
      opponent: data.opponent,
      pitchName: data.pitchName,
      sideSize: data.sideSize,
    },
  })
  revalidatePath('/matches')
  return match
}

export async function deleteMatch(id: string) {
  await prisma.match.delete({
    where: { id },
  })
  revalidatePath('/matches')
}

export async function updatePlayerAvailability(
  matchId: string,
  playerId: string,
  isAvailable: boolean
) {
  await prisma.matchPlayer.updateMany({
    where: {
      matchId,
      playerId,
    },
    data: { isAvailable },
  })
  revalidatePath(`/matches/${matchId}`)
}

export async function updateMatchPlayers(
  matchId: string,
  playerIds: string[]
) {
  // Get existing match players
  const existing = await prisma.matchPlayer.findMany({
    where: { matchId },
  })
  
  const existingIds = existing.map(mp => mp.playerId)
  
  // Players to add
  const toAdd = playerIds.filter(id => !existingIds.includes(id))
  
  // Players to remove
  const toRemove = existingIds.filter(id => !playerIds.includes(id))
  
  // Add new players
  if (toAdd.length > 0) {
    await prisma.matchPlayer.createMany({
      data: toAdd.map(playerId => ({
        matchId,
        playerId,
        isAvailable: true,
      })),
    })
  }
  
  // Remove players
  if (toRemove.length > 0) {
    await prisma.matchPlayer.deleteMany({
      where: {
        matchId,
        playerId: { in: toRemove },
      },
    })
  }
  
  revalidatePath(`/matches/${matchId}`)
}

export async function saveMatchStats(
  matchId: string,
  stats: Array<{
    playerId: string
    played: boolean
    team?: 'WHITE' | 'BLACK'
    minutes?: number
    goals?: number
    assists?: number
    defensiveActions?: number
    motmVotes?: number
    teamGD?: number
  }>
) {
  for (const stat of stats) {
    await prisma.matchPlayer.updateMany({
      where: {
        matchId,
        playerId: stat.playerId,
      },
      data: {
        played: stat.played,
        team: stat.team || null,
        minutes: stat.minutes || 90,
        goals: stat.goals || 0,
        assists: stat.assists || 0,
        defensiveActions: stat.defensiveActions || 0,
        motmVotes: stat.motmVotes || 0,
        teamGD: stat.teamGD || 0,
      },
    })
  }
  
  revalidatePath(`/matches/${matchId}`)
}

export async function completeMatch(matchId: string) {
  await prisma.match.update({
    where: { id: matchId },
    data: { isComplete: true },
  })
  revalidatePath(`/matches/${matchId}`)
  revalidatePath('/dashboard')
}
