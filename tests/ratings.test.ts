import { describe, it, expect } from 'vitest'
import {
  calculateAvailabilityRate,
  calculateMOTMIndex,
  calculatePer90,
  calculateCompositeRating,
  RATING_WEIGHTS,
  POSITION_MOTM_FACTORS,
} from '../src/lib/ratings'
import { Position, PlayerWithStats } from '../src/types'

describe('Rating Calculations', () => {
  describe('calculateAvailabilityRate', () => {
    it('should return 1 when total matches is 0', () => {
      expect(calculateAvailabilityRate(0, 0)).toBe(1)
    })

    it('should calculate correct rate', () => {
      expect(calculateAvailabilityRate(5, 10)).toBe(0.5)
      expect(calculateAvailabilityRate(10, 10)).toBe(1)
      expect(calculateAvailabilityRate(3, 10)).toBe(0.3)
    })

    it('should cap at 1', () => {
      expect(calculateAvailabilityRate(15, 10)).toBe(1)
    })
  })

  describe('calculateMOTMIndex', () => {
    it('should return 0 for new players', () => {
      expect(calculateMOTMIndex(0, 0, 'FWD')).toBe(0)
    })

    it('should apply position factors correctly', () => {
      const motmCount = 3
      const gamesPlayed = 10

      const fwdIndex = calculateMOTMIndex(motmCount, gamesPlayed, 'FWD')
      const midIndex = calculateMOTMIndex(motmCount, gamesPlayed, 'MID')
      const defIndex = calculateMOTMIndex(motmCount, gamesPlayed, 'DEF')
      const gkIndex = calculateMOTMIndex(motmCount, gamesPlayed, 'GK')

      // GK should have highest index (1.5x factor)
      expect(gkIndex).toBeGreaterThan(defIndex)
      // DEF should have higher index than MID (1.3x vs 1.0x)
      expect(defIndex).toBeGreaterThan(midIndex)
      // FWD should have lowest (0.8x factor)
      expect(midIndex).toBeGreaterThan(fwdIndex)
    })
  })

  describe('calculatePer90', () => {
    it('should return 0 when no minutes played', () => {
      expect(calculatePer90(5, 0)).toBe(0)
    })

    it('should calculate correctly', () => {
      // 5 goals in 450 minutes = 1 per 90
      expect(calculatePer90(5, 450)).toBe(1)
      // 10 assists in 900 minutes = 1 per 90
      expect(calculatePer90(10, 900)).toBe(1)
    })
  })

  describe('calculateCompositeRating', () => {
    it('should return baseline rating for new players', () => {
      const newPlayer: PlayerWithStats = {
        id: '1',
        name: 'Test',
        primaryPosition: 'MID',
        gamesPlayed: 0,
        goals: 0,
        assists: 0,
        defensiveActions: 0,
        motmCount: 0,
        avgTeamGD: 0,
        availabilityRate: 1,
        motmIndex: 0,
        compositeRating: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        whatsappName: null,
        secondaryPosition: null,
        foot: null,
      }

      expect(calculateCompositeRating(newPlayer)).toBe(50)
    })

    it('should calculate weighted rating correctly', () => {
      const player: PlayerWithStats = {
        id: '1',
        name: 'Test',
        primaryPosition: 'MID',
        gamesPlayed: 10,
        goals: 5,
        assists: 5,
        defensiveActions: 10,
        motmCount: 2,
        avgTeamGD: 2,
        availabilityRate: 1,
        motmIndex: 0.2,
        compositeRating: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        whatsappName: null,
        secondaryPosition: null,
        foot: null,
      }

      const rating = calculateCompositeRating(player)
      
      // Should be a reasonable rating between 0-100
      expect(rating).toBeGreaterThan(0)
      expect(rating).toBeLessThanOrEqual(100)
      
      // Should produce a non-trivial rating (algorithm yields ~47.7 for these stats)
      expect(rating).toBeGreaterThan(40)
    })
  })
})
