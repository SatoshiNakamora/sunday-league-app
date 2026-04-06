import { describe, it, expect } from 'vitest'
import { validatePlayerData, validateMatchData, clampStat } from '../src/lib/validation'

describe('validatePlayerData', () => {
  const validBase = { name: 'John Smith', primaryPosition: 'GK' }

  it('accepts valid player data', () => {
    expect(() => validatePlayerData(validBase)).not.toThrow()
  })

  it('accepts all valid positions as primary', () => {
    for (const pos of ['GK', 'DEF', 'MID', 'FWD']) {
      expect(() => validatePlayerData({ ...validBase, primaryPosition: pos })).not.toThrow()
    }
  })

  it('accepts all valid foot values', () => {
    for (const foot of ['LEFT', 'RIGHT', 'BOTH']) {
      expect(() => validatePlayerData({ ...validBase, foot })).not.toThrow()
    }
  })

  it('accepts undefined optional fields', () => {
    expect(() =>
      validatePlayerData({ ...validBase, secondaryPosition: undefined, foot: undefined }),
    ).not.toThrow()
  })

  it('throws if name is empty', () => {
    expect(() => validatePlayerData({ ...validBase, name: '' })).toThrow()
    expect(() => validatePlayerData({ ...validBase, name: '   ' })).toThrow()
  })

  it('throws if name exceeds 100 characters', () => {
    expect(() => validatePlayerData({ ...validBase, name: 'a'.repeat(101) })).toThrow()
  })

  it('throws on invalid primary position', () => {
    expect(() => validatePlayerData({ ...validBase, primaryPosition: 'STRIKER' })).toThrow()
    expect(() => validatePlayerData({ ...validBase, primaryPosition: '' })).toThrow()
  })

  it('throws on invalid secondary position', () => {
    expect(() =>
      validatePlayerData({ ...validBase, secondaryPosition: 'WINGER' }),
    ).toThrow()
  })

  it('throws on invalid foot value', () => {
    expect(() => validatePlayerData({ ...validBase, foot: 'STRONG' })).toThrow()
  })
})

describe('validateMatchData', () => {
  const validDate = new Date('2026-04-01T10:00:00Z')
  const validBase = { date: validDate, opponent: 'Local FC', sideSize: 7 }

  it('accepts valid match data', () => {
    expect(() => validateMatchData(validBase)).not.toThrow()
  })

  it('accepts all valid side sizes (5–12)', () => {
    for (let n = 5; n <= 12; n++) {
      expect(() => validateMatchData({ ...validBase, sideSize: n })).not.toThrow()
    }
  })

  it('throws if opponent is empty', () => {
    expect(() => validateMatchData({ ...validBase, opponent: '' })).toThrow()
    expect(() => validateMatchData({ ...validBase, opponent: '   ' })).toThrow()
  })

  it('throws if opponent exceeds 100 characters', () => {
    expect(() =>
      validateMatchData({ ...validBase, opponent: 'x'.repeat(101) }),
    ).toThrow()
  })

  it('throws if side size is below 5', () => {
    expect(() => validateMatchData({ ...validBase, sideSize: 4 })).toThrow()
    expect(() => validateMatchData({ ...validBase, sideSize: 0 })).toThrow()
  })

  it('throws if side size is above 12', () => {
    expect(() => validateMatchData({ ...validBase, sideSize: 13 })).toThrow()
  })

  it('throws if side size is NaN', () => {
    expect(() => validateMatchData({ ...validBase, sideSize: NaN })).toThrow()
  })

  it('throws if date is invalid', () => {
    expect(() => validateMatchData({ ...validBase, date: new Date('not-a-date') })).toThrow()
  })
})

describe('clampStat', () => {
  it('returns value as-is within 0–99 range', () => {
    expect(clampStat(0)).toBe(0)
    expect(clampStat(50)).toBe(50)
    expect(clampStat(99)).toBe(99)
  })

  it('clamps negative numbers to 0', () => {
    expect(clampStat(-1)).toBe(0)
    expect(clampStat(-100)).toBe(0)
  })

  it('clamps values above 99 to 99', () => {
    expect(clampStat(100)).toBe(99)
    expect(clampStat(999)).toBe(99)
  })

  it('handles string inputs', () => {
    expect(clampStat('5')).toBe(5)
    expect(clampStat('-3')).toBe(0)
    expect(clampStat('200')).toBe(99)
  })

  it('returns 0 for non-numeric strings', () => {
    expect(clampStat('abc')).toBe(0)
    expect(clampStat('')).toBe(0)
  })
})
