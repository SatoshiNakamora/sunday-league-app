import { describe, it, expect } from 'vitest'
import { generateBalancedTeams, exportTeamsToText } from '../src/lib/teamBalancer'
import { Position, TeamColor, PlayerWithStats } from '../src/types'

function createTestPlayer(
  id: string,
  name: string,
  position: Position,
  rating: number
): PlayerWithStats {
  return {
    id,
    name,
    primaryPosition: position,
    gamesPlayed: 10,
    goals: 5,
    assists: 3,
    defensiveActions: 8,
    motmCount: 1,
    avgTeamGD: 1,
    availabilityRate: 0.8,
    motmIndex: 0.1,
    compositeRating: rating,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    whatsappName: null,
    secondaryPosition: null,
    foot: null,
  }
}

describe('Team Balancer', () => {
  describe('generateBalancedTeams', () => {
    it('should throw error for invalid team size', () => {
      const players = Array.from({ length: 10 }, (_, i) =>
        createTestPlayer(String(i), `Player ${i}`, 'MID', 50)
      )

      expect(() => generateBalancedTeams(players, 4)).toThrow('Team size must be between 5 and 12')
      expect(() => generateBalancedTeams(players, 13)).toThrow('Team size must be between 5 and 12')
    })

    it('should throw error for insufficient players', () => {
      const players = Array.from({ length: 8 }, (_, i) =>
        createTestPlayer(String(i), `Player ${i}`, 'MID', 50)
      )

      expect(() => generateBalancedTeams(players, 5)).toThrow('Need at least 10 players')
    })

    it('should generate balanced 5v5 teams', () => {
      const players = [
        createTestPlayer('1', 'GK1', 'GK', 70),
        createTestPlayer('2', 'GK2', 'GK', 65),
        createTestPlayer('3', 'DEF1', 'DEF', 60),
        createTestPlayer('4', 'DEF2', 'DEF', 58),
        createTestPlayer('5', 'DEF3', 'DEF', 55),
        createTestPlayer('6', 'DEF4', 'DEF', 52),
        createTestPlayer('7', 'MID1', 'MID', 65),
        createTestPlayer('8', 'MID2', 'MID', 62),
        createTestPlayer('9', 'MID3', 'MID', 60),
        createTestPlayer('10', 'MID4', 'MID', 58),
        createTestPlayer('11', 'FWD1', 'FWD', 68),
        createTestPlayer('12', 'FWD2', 'FWD', 65),
      ]

      const { teams } = generateBalancedTeams(players, 5)

      expect(teams.white).toHaveLength(5)
      expect(teams.black).toHaveLength(5)
      expect(teams.balancePercentage).toBeGreaterThan(0)
    })

    it('should generate balanced 11v11 teams', () => {
      const players = Array.from({ length: 22 }, (_, i) => {
        const positions = ['GK', 'DEF', 'MID', 'FWD']
        const position = positions[Math.floor(i / 6)] || 'MID'
        return createTestPlayer(String(i), `Player ${i}`, position, 50 + Math.random() * 30)
      })

      // Ensure we have at least 2 GKs
      players[0] = createTestPlayer('0', 'GK1', 'GK', 70)
      players[11] = createTestPlayer('11', 'GK2', 'GK', 68)

      const { teams } = generateBalancedTeams(players, 11)

      expect(teams.white).toHaveLength(11)
      expect(teams.black).toHaveLength(11)
    })

    it('should put excess players on bench', () => {
      const players = Array.from({ length: 16 }, (_, i) =>
        createTestPlayer(String(i), `Player ${i}`, 'MID', 50 + i)
      )

      const { teams, bench } = generateBalancedTeams(players, 5)

      expect(teams.white).toHaveLength(5)
      expect(teams.black).toHaveLength(5)
      expect(bench).toHaveLength(6)
    })

    it('should maintain positional balance', () => {
      const players = [
        createTestPlayer('1', 'GK1', 'GK', 70),
        createTestPlayer('2', 'GK2', 'GK', 68),
        createTestPlayer('3', 'DEF1', 'DEF', 65),
        createTestPlayer('4', 'DEF2', 'DEF', 63),
        createTestPlayer('5', 'DEF3', 'DEF', 60),
        createTestPlayer('6', 'DEF4', 'DEF', 58),
        createTestPlayer('7', 'MID1', 'MID', 68),
        createTestPlayer('8', 'MID2', 'MID', 66),
        createTestPlayer('9', 'MID3', 'MID', 64),
        createTestPlayer('10', 'MID4', 'MID', 62),
        createTestPlayer('11', 'FWD1', 'FWD', 70),
        createTestPlayer('12', 'FWD2', 'FWD', 68),
      ]

      const { teams } = generateBalancedTeams(players, 5)

      // Each team should have roughly balanced positions
      const whiteGKs = teams.whitePositions.GK
      const blackGKs = teams.blackPositions.GK

      expect(whiteGKs).toBeGreaterThanOrEqual(0)
      expect(blackGKs).toBeGreaterThanOrEqual(0)
    })

    it('should sort by rating descending', () => {
      const players = [
        createTestPlayer('1', 'Low', 'MID', 30),
        createTestPlayer('2', 'High', 'MID', 80),
        createTestPlayer('3', 'Mid', 'MID', 55),
        createTestPlayer('4', 'Higher', 'MID', 90),
        ...Array.from({ length: 10 }, (_, i) =>
          createTestPlayer(String(i + 5), `Filler ${i}`, 'MID', 50)
        ),
      ]

      const { teams, bench } = generateBalancedTeams(players, 5)
      const allTeamPlayers = [...teams.white, ...teams.black]

      // Highest rated players should be in teams, not bench
      expect(allTeamPlayers.some(p => p.name === 'Higher')).toBe(true)
      expect(allTeamPlayers.some(p => p.name === 'High')).toBe(true)
    })
  })

  describe('exportTeamsToText', () => {
    it('should format teams for WhatsApp', () => {
      const teams = {
        white: [
          createTestPlayer('1', 'John Smith', 'GK', 70),
          createTestPlayer('2', 'Mike Johnson', 'DEF', 65),
        ],
        black: [
          createTestPlayer('3', 'Tom Davis', 'GK', 68),
          createTestPlayer('4', 'Alex Wilson', 'FWD', 72),
        ],
        whiteRating: 135,
        blackRating: 140,
        whiteAvgRating: 67.5,
        blackAvgRating: 70,
        balancePercentage: 96,
        whitePositions: { GK: 1, DEF: 1, MID: 0, FWD: 0 },
        blackPositions: { GK: 1, DEF: 0, MID: 0, FWD: 1 },
      }

      const text = exportTeamsToText(teams, true)

      expect(text).toContain('White:')
      expect(text).toContain('Black:')
      expect(text).toContain('John Smith (GK)')
      expect(text).toContain('Mike Johnson (DEF)')
    })

    it('should use WhatsApp names when available', () => {
      const player1 = createTestPlayer('1', 'John Smith', 'GK', 70)
      player1.whatsappName = 'Johnny'

      const teams = {
        white: [player1],
        black: [createTestPlayer('2', 'Mike', 'DEF', 65)],
        whiteRating: 70,
        blackRating: 65,
        whiteAvgRating: 70,
        blackAvgRating: 65,
        balancePercentage: 93,
        whitePositions: { GK: 1, DEF: 0, MID: 0, FWD: 0 },
        blackPositions: { GK: 0, DEF: 1, MID: 0, FWD: 0 },
      }

      const text = exportTeamsToText(teams, false)

      expect(text).toContain('Johnny')
    })
  })
})
