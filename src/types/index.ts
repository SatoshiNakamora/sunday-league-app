export type Position = 'GK' | 'DEF' | 'MID' | 'FWD'
export type Foot = 'LEFT' | 'RIGHT' | 'BOTH'
export type TeamColor = 'WHITE' | 'BLACK'

export interface Player {
  id: string
  name: string
  whatsappName: string | null
  primaryPosition: Position
  secondaryPosition: Position | null
  foot: Foot | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Match {
  id: string
  date: Date
  opponent: string
  pitchName: string | null
  sideSize: number
  isComplete: boolean
  createdAt: Date
  updatedAt: Date
}

export interface MatchPlayer {
  id: string
  matchId: string
  playerId: string
  isAvailable: boolean
  played: boolean
  team: TeamColor | null
  minutes: number | null
  goals: number
  assists: number
  defensiveActions: number
  motmVotes: number
  teamGD: number | null
  createdAt: Date
  updatedAt: Date
  player: Player
}

export interface PlayerWithStats extends Player {
  gamesPlayed: number
  goals: number
  assists: number
  defensiveActions: number
  motmCount: number
  motmIndex: number
  availabilityRate: number
  avgTeamGD: number
  compositeRating: number
}

export interface TeamAssignment {
  playerId: string
  team: TeamColor
}

export interface BalancedTeams {
  white: PlayerWithStats[]
  black: PlayerWithStats[]
  whiteRating: number
  blackRating: number
  whiteAvgRating: number
  blackAvgRating: number
  balancePercentage: number
  whitePositions: Record<Position, number>
  blackPositions: Record<Position, number>
}
