'use server'

import { prisma } from '@/lib/prisma'
import { Position, Foot } from '@/types'
import { revalidatePath } from 'next/cache'
import { validatePlayerData as _validatePlayerData } from '@/lib/validation'

// Player Actions
export async function getPlayers() {
  return prisma.player.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  })
}

export async function getAllPlayers() {
  return prisma.player.findMany({
    orderBy: { name: 'asc' },
  })
}

export async function getPlayer(id: string) {
  return prisma.player.findUnique({
    where: { id },
  })
}

export async function createPlayer(data: {
  name: string
  whatsappName?: string
  primaryPosition: Position
  secondaryPosition?: Position
  foot?: Foot
}) {
  _validatePlayerData(data)
  const player = await prisma.player.create({
    data: {
      name: data.name,
      whatsappName: data.whatsappName || null,
      primaryPosition: data.primaryPosition,
      secondaryPosition: data.secondaryPosition || null,
      foot: data.foot || null,
    },
  })
  revalidatePath('/players')
  return player
}

export async function updatePlayer(
  id: string,
  data: {
    name: string
    whatsappName?: string
    primaryPosition: Position
    secondaryPosition?: Position
    foot?: Foot
  }
) {
  _validatePlayerData(data)
  const player = await prisma.player.update({
    where: { id },
    data: {
      name: data.name,
      whatsappName: data.whatsappName || null,
      primaryPosition: data.primaryPosition,
      secondaryPosition: data.secondaryPosition || null,
      foot: data.foot || null,
    },
  })
  revalidatePath('/players')
  return player
}

export async function deletePlayer(id: string) {
  // Soft delete
  await prisma.player.update({
    where: { id },
    data: { isActive: false },
  })
  revalidatePath('/players')
}

export async function restorePlayer(id: string) {
  await prisma.player.update({
    where: { id },
    data: { isActive: true },
  })
  revalidatePath('/players')
}
