import { Position, Foot } from '@/types'

export const VALID_POSITIONS: Position[] = ['GK', 'DEF', 'MID', 'FWD']
export const VALID_FEET: Foot[] = ['LEFT', 'RIGHT', 'BOTH']

export function validatePlayerData(data: {
  name: string
  primaryPosition: string
  secondaryPosition?: string
  foot?: string
}): void {
  if (!data.name || data.name.trim().length === 0 || data.name.length > 100) {
    throw new Error('Player name must be 1–100 characters')
  }
  if (!VALID_POSITIONS.includes(data.primaryPosition as Position)) {
    throw new Error('Invalid primary position')
  }
  if (data.secondaryPosition && !VALID_POSITIONS.includes(data.secondaryPosition as Position)) {
    throw new Error('Invalid secondary position')
  }
  if (data.foot && !VALID_FEET.includes(data.foot as Foot)) {
    throw new Error('Invalid foot preference')
  }
}

export function validateMatchData(data: {
  date: Date
  opponent: string
  sideSize: number
}): void {
  if (!data.opponent || data.opponent.trim().length === 0 || data.opponent.length > 100) {
    throw new Error('Opponent name must be 1–100 characters')
  }
  if (isNaN(data.sideSize) || data.sideSize < 5 || data.sideSize > 12) {
    throw new Error('Side size must be between 5 and 12')
  }
  if (!(data.date instanceof Date) || isNaN(data.date.getTime())) {
    throw new Error('Invalid match date')
  }
}

/** Clamps a stat value to 0–99 range */
export function clampStat(value: string | number): number {
  const n = typeof value === 'string' ? parseInt(value) : value
  return Math.max(0, Math.min(99, isNaN(n) ? 0 : n))
}
