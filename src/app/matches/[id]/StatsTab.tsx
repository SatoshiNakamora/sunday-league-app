'use client'

import { useState } from 'react'
import { saveMatchStats, completeMatch } from '@/app/actions/matches'
import { Player } from '@/types'
import { Save, CheckCircle, User } from 'lucide-react'

interface MatchPlayer {
  id: string
  playerId: string
  played: boolean
  team: string | null
  goals: number
  assists: number
  defensiveActions: number
  motmVotes: number
  player: Player
}

interface StatsTabProps {
  match: {
    id: string
    isComplete: boolean
    sideSize: number
    matchPlayers: MatchPlayer[]
  }
  matchId: string
  generatedTeams: {
    white: { id: string }[]
    black: { id: string }[]
  } | null
}

export function StatsTab({ match, matchId, generatedTeams }: StatsTabProps) {
  const [saving, setSaving] = useState(false)
  const [stats, setStats] = useState<Record<string, {
    played: boolean
    team: 'WHITE' | 'BLACK' | null
    goals: number
    assists: number
    defensiveActions: number
    motmVotes: number
  }>>(() => {
    const initial: Record<string, any> = {}
    match.matchPlayers.forEach(mp => {
      initial[mp.playerId] = {
        played: mp.played,
        team: mp.team,
        goals: mp.goals,
        assists: mp.assists,
        defensiveActions: mp.defensiveActions,
        motmVotes: mp.motmVotes,
      }
    })
    return initial
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      const statsArray = Object.entries(stats).map(([playerId, playerStats]) => ({
        playerId,
        played: playerStats.played,
        team: playerStats.team || undefined,
        goals: playerStats.goals,
        assists: playerStats.assists,
        defensiveActions: playerStats.defensiveActions,
        motmVotes: playerStats.motmVotes,
      }))
      await saveMatchStats(matchId, statsArray)
      window.location.reload()
    } catch (error) {
      console.error('Failed to save stats:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleComplete = async () => {
    if (!confirm('Are you sure you want to mark this match as complete?')) return
    try {
      await completeMatch(matchId)
      window.location.reload()
    } catch (error) {
      console.error('Failed to complete match:', error)
    }
  }

  const whiteTeam = match.matchPlayers.filter(mp => stats[mp.id]?.team === 'WHITE')
  const blackTeam = match.matchPlayers.filter(mp => stats[mp.id]?.team === 'BLACK')

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Match Statistics</h3>
        <div className="flex space-x-3">
          {!match.isComplete && (
            <button
              onClick={handleComplete}
              className="btn-primary flex items-center space-x-2"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Complete Match</span>
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-secondary flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save Stats'}</span>
          </button>
        </div>
      </div>

      {/* White Team */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-300"></div>
          <span>White Team ({whiteTeam.length})</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase">
                <th className="pb-3">Player</th>
                <th className="pb-3 w-20">Played</th>
                <th className="pb-3 w-20">Team</th>
                <th className="pb-3 w-16 text-center">Goals</th>
                <th className="pb-3 w-16 text-center">Assists</th>
                <th className="pb-3 w-20 text-center">Defensive</th>
                <th className="pb-3 w-16 text-center">MOTM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stadium-700/50">
              {match.matchPlayers.map((mp) => (
                <tr key={mp.id} className="hover:bg-stadium-800/30">
                  <td className="py-3">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-white font-medium">{mp.player.name}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <input
                      type="checkbox"
                      checked={stats[mp.id]?.played || false}
                      onChange={(e) => setStats({
                        ...stats,
                        [mp.id]: { ...stats[mp.id], played: e.target.checked }
                      })}
                      className="checkbox-field rounded"
                    />
                  </td>
                  <td className="py-3">
                    <select
                      value={stats[mp.id]?.team || ''}
                      onChange={(e) => setStats({
                        ...stats,
                        [mp.id]: { ...stats[mp.id], team: e.target.value as any }
                      })}
                      className="select-field text-sm py-1.5"
                    >
                      <option value="">-</option>
                      <option value="WHITE">White</option>
                      <option value="BLACK">Black</option>
                    </select>
                  </td>
                  <td className="py-3">
                    <input
                      type="number"
                      min="0"
                      value={stats[mp.id]?.goals || 0}
                      onChange={(e) => setStats({
                        ...stats,
                        [mp.id]: { ...stats[mp.id], goals: parseInt(e.target.value) || 0 }
                      })}
                      className="input-field text-center py-1.5 w-16"
                    />
                  </td>
                  <td className="py-3">
                    <input
                      type="number"
                      min="0"
                      value={stats[mp.id]?.assists || 0}
                      onChange={(e) => setStats({
                        ...stats,
                        [mp.id]: { ...stats[mp.id], assists: parseInt(e.target.value) || 0 }
                      })}
                      className="input-field text-center py-1.5 w-16"
                    />
                  </td>
                  <td className="py-3">
                    <input
                      type="number"
                      min="0"
                      value={stats[mp.id]?.defensiveActions || 0}
                      onChange={(e) => setStats({
                        ...stats,
                        [mp.id]: { ...stats[mp.id], defensiveActions: parseInt(e.target.value) || 0 }
                      })}
                      className="input-field text-center py-1.5 w-16"
                    />
                  </td>
                  <td className="py-3">
                    <input
                      type="number"
                      min="0"
                      max="1"
                      value={stats[mp.id]?.motmVotes || 0}
                      onChange={(e) => setStats({
                        ...stats,
                        [mp.id]: { ...stats[mp.id], motmVotes: parseInt(e.target.value) || 0 }
                      })}
                      className="input-field text-center py-1.5 w-16"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}