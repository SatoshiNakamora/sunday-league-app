'use client'

import { useState } from 'react'
import { saveMatchStats, completeMatch } from '@/app/actions/matches'
import { Player } from '@/types'
import { Save, CheckCircle, Trophy, Target, Shield, Star, Users, TrendingUp, Zap } from 'lucide-react'

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
    date: Date
    opponent: string
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
  const [showSaveConfirm, setShowSaveConfirm] = useState(false)
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
      initial[mp.id] = {
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
      setShowSaveConfirm(true)
      setTimeout(() => setShowSaveConfirm(false), 2000)
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

  // Calculate match summary
  const allPlayers = match.matchPlayers
  const whiteTeam = allPlayers.filter(mp => stats[mp.id]?.team === 'WHITE')
  const blackTeam = allPlayers.filter(mp => stats[mp.id]?.team === 'BLACK')

  const whiteGoals = whiteTeam.reduce((sum, mp) => sum + (stats[mp.id]?.goals || 0), 0)
  const blackGoals = blackTeam.reduce((sum, mp) => sum + (stats[mp.id]?.goals || 0), 0)
  const totalGoals = allPlayers.reduce((sum, mp) => sum + (stats[mp.id]?.goals || 0), 0)
  const totalAssists = allPlayers.reduce((sum, mp) => sum + (stats[mp.id]?.assists || 0), 0)
  const totalDefensive = allPlayers.reduce((sum, mp) => sum + (stats[mp.id]?.defensiveActions || 0), 0)
  const totalMotmVotes = allPlayers.reduce((sum, mp) => sum + (stats[mp.id]?.motmVotes || 0), 0)

  // Find MOTM
  const motmCandidate = allPlayers.reduce((best, mp) => {
    const currentVotes = stats[mp.id]?.motmVotes || 0
    const bestVotes = stats[best.id]?.motmVotes || 0
    return currentVotes > bestVotes ? mp : best
  }, allPlayers[0])

  return (
    <div className="space-y-8">
      {/* Match Scoreboard Header */}
      <div className="card relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-cyan-300 to-cyan-500" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Scoreboard Display */}
          <div className="flex items-center space-x-8">
            {/* White Team Score */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/40 flex items-center justify-center mb-2 mx-auto">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-300" />
              </div>
              <span className="text-xs font-black text-white/70 uppercase tracking-widest">White</span>
              <p className="text-5xl font-black text-white font-mono tabular-nums mt-1">
                {whiteGoals}
              </p>
            </div>

            {/* VS Divider */}
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-cyan-400/50">VS</span>
              <div className="w-px h-12 bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent my-2" />
              <span className="text-xs text-gray-500 uppercase">Final</span>
            </div>

            {/* Black Team Score */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gray-800/50 border-2 border-gray-600/50 flex items-center justify-center mb-2 mx-auto">
                <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-600" />
              </div>
              <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Black</span>
              <p className="text-5xl font-black text-gray-300 font-mono tabular-nums mt-1">
                {blackGoals}
              </p>
            </div>
          </div>

          {/* Match Stats Summary */}
          <div className="grid grid-cols-4 gap-4">
            <StatBox icon={Target} value={totalGoals} label="Goals" color="cyan" />
            <StatBox icon={TrendingUp} value={totalAssists} label="Assists" color="green" />
            <StatBox icon={Shield} value={totalDefensive} label="Defensive" color="blue" />
            <StatBox icon={Trophy} value={totalMotmVotes} label="MOTM" color="yellow" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-end gap-4 mt-6 pt-6 border-t border-stadium-700/50">
          {!match.isComplete && (
            <button
              onClick={handleComplete}
              className="btn-primary flex items-center space-x-2"
            >
              <CheckCircle className="h-5 w-5" />
              <span>Complete Match</span>
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving || showSaveConfirm}
            className={`btn-secondary flex items-center space-x-2 ${
              showSaveConfirm ? 'border-green-400 text-green-400' : ''
            }`}
          >
            {showSaveConfirm ? (
              <>
                <CheckCircle className="h-5 w-5" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>{saving ? 'Saving...' : 'Save Stats'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Player Stats Table */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-cyan-500/20 clip-corner-sm">
            <Users className="h-5 w-5 text-cyan-400" />
          </div>
          <h3 className="text-lg font-black text-white uppercase tracking-widest">
            Player Statistics
          </h3>
        </div>

        {/* Table Header */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-cyan-500/30">
                <th className="text-left py-4 px-4 text-xs font-black text-cyan-400/70 uppercase tracking-widest">
                  Player
                </th>
                <th className="text-center py-4 px-3 text-xs font-black text-cyan-400/70 uppercase tracking-widest">
                  Played
                </th>
                <th className="text-center py-4 px-3 text-xs font-black text-cyan-400/70 uppercase tracking-widest">
                  Team
                </th>
                <th className="text-center py-4 px-3 text-xs font-black text-red-400/70 uppercase tracking-widest">
                  Goals
                </th>
                <th className="text-center py-4 px-3 text-xs font-black text-green-400/70 uppercase tracking-widest">
                  Assists
                </th>
                <th className="text-center py-4 px-3 text-xs font-black text-blue-400/70 uppercase tracking-widest">
                  Defensive
                </th>
                <th className="text-center py-4 px-3 text-xs font-black text-yellow-400/70 uppercase tracking-widest">
                  MOTM
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stadium-700/30">
              {match.matchPlayers.map((mp, index) => (
                <tr
                  key={mp.id}
                  className={`hover:bg-cyan-500/5 transition-all duration-200 ${
                    stats[mp.id]?.motmVotes > 0 ? 'bg-yellow-500/5' : ''
                  }`}
                >
                  {/* Player Name */}
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-sm text-gray-600 w-6">{index + 1}</span>
                      <div>
                        <div className={`font-bold uppercase tracking-wide ${
                          stats[mp.id]?.motmVotes > 0 ? 'text-yellow-400' : 'text-white'
                        }`}>
                          {mp.player.name}
                        </div>
                        <div className="text-xs text-gray-500">{mp.player.primaryPosition}</div>
                      </div>
                    </div>
                  </td>

                  {/* Played Checkbox */}
                  <td className="py-4 px-3 text-center">
                    <button
                      onClick={() => setStats({
                        ...stats,
                        [mp.id]: { ...stats[mp.id], played: !stats[mp.id]?.played }
                      })}
                      className={`w-8 h-8 mx-auto rounded border-2 transition-all duration-200 flex items-center justify-center ${
                        stats[mp.id]?.played
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400'
                          : 'bg-black/40 border-stadium-600 text-transparent'
                      }`}
                    >
                      {stats[mp.id]?.played && <CheckCircle className="h-5 w-5" />}
                    </button>
                  </td>

                  {/* Team Selector */}
                  <td className="py-4 px-3 text-center">
                    <select
                      value={stats[mp.id]?.team || ''}
                      onChange={(e) => setStats({
                        ...stats,
                        [mp.id]: { ...stats[mp.id], team: e.target.value as any }
                      })}
                      className="select-field text-sm py-2 w-24 mx-auto"
                    >
                      <option value="">-</option>
                      <option value="WHITE">White</option>
                      <option value="BLACK">Black</option>
                    </select>
                  </td>

                  {/* Goals Input */}
                  <td className="py-4 px-3 text-center">
                    <StatInput
                      value={stats[mp.id]?.goals || 0}
                      onChange={(val) => setStats({
                        ...stats,
                        [mp.id]: { ...stats[mp.id], goals: val }
                      })}
                      color="red"
                    />
                  </td>

                  {/* Assists Input */}
                  <td className="py-4 px-3 text-center">
                    <StatInput
                      value={stats[mp.id]?.assists || 0}
                      onChange={(val) => setStats({
                        ...stats,
                        [mp.id]: { ...stats[mp.id], assists: val }
                      })}
                      color="green"
                    />
                  </td>

                  {/* Defensive Input */}
                  <td className="py-4 px-3 text-center">
                    <StatInput
                      value={stats[mp.id]?.defensiveActions || 0}
                      onChange={(val) => setStats({
                        ...stats,
                        [mp.id]: { ...stats[mp.id], defensiveActions: val }
                      })}
                      color="blue"
                    />
                  </td>

                  {/* MOTM Input */}
                  <td className="py-4 px-3 text-center">
                    <MOTMVoteInput
                      value={stats[mp.id]?.motmVotes || 0}
                      onChange={(val) => setStats({
                        ...stats,
                        [mp.id]: { ...stats[mp.id], motmVotes: val }
                      })}
                      isLeading={stats[mp.id]?.motmVotes > 0 && mp.id === motmCandidate?.id}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Match Summary Card (shown when complete) */}
      {match.isComplete && (
        <div className="card bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-yellow-500/20 clip-corner-sm">
              <Trophy className="h-6 w-6 text-yellow-400" />
            </div>
            <h3 className="text-lg font-black text-yellow-400 uppercase tracking-widest">
              Man of the Match
            </h3>
          </div>

          {motmCandidate && stats[motmCandidate.id]?.motmVotes > 0 ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-yellow-500/20 border-2 border-yellow-400/40 flex items-center justify-center">
                  <Star className="h-8 w-8 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-black text-yellow-400 uppercase">
                    {motmCandidate.player.name}
                  </p>
                  <p className="text-gray-400">{motmCandidate.player.primaryPosition}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-black text-yellow-400 font-mono tabular-nums">
                  {stats[motmCandidate.id]?.motmVotes}
                </p>
                <p className="text-xs text-yellow-400/70 uppercase tracking-widest">Votes</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No MOTM votes recorded</p>
          )}
        </div>
      )}
    </div>
  )
}

function StatBox({
  icon: Icon,
  value,
  label,
  color
}: {
  icon: typeof Target
  value: number
  label: string
  color: 'cyan' | 'green' | 'blue' | 'yellow' | 'red'
}) {
  const colors: Record<string, string> = {
    cyan: 'text-cyan-400',
    green: 'text-green-400',
    blue: 'text-blue-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
  }

  return (
    <div className="text-center p-3 bg-black/40 border border-stadium-700/50 clip-corner-sm">
      <Icon className={`h-5 w-5 mx-auto mb-1 ${colors[color]}`} />
      <p className={`text-2xl font-black font-mono tabular-nums ${colors[color]}`}>
        {value}
      </p>
      <p className="text-xs text-gray-500 uppercase tracking-widest">{label}</p>
    </div>
  )
}

function StatInput({
  value,
  onChange,
  color,
}: {
  value: number
  onChange: (val: number) => void
  color: 'red' | 'green' | 'blue'
}) {
  const colors: Record<string, string> = {
    red: 'text-red-400 border-red-500/40 focus:border-red-400',
    green: 'text-green-400 border-green-500/40 focus:border-green-400',
    blue: 'text-blue-400 border-blue-500/40 focus:border-blue-400',
  }

  return (
    <div className="flex items-center justify-center space-x-1">
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-7 h-7 rounded bg-black/40 border border-stadium-600 text-gray-400 hover:border-stadium-500 hover:text-white transition-all flex items-center justify-center"
      >
        -
      </button>
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => onChange(Math.max(0, parseInt(e.target.value) || 0))}
        className={`w-12 h-10 bg-black/60 border-2 ${colors[color]} text-center font-mono text-lg font-bold rounded focus:outline-none focus:ring-0 transition-all`}
      />
      <button
        onClick={() => onChange(value + 1)}
        className="w-7 h-7 rounded bg-black/40 border border-stadium-600 text-gray-400 hover:border-stadium-500 hover:text-white transition-all flex items-center justify-center"
      >
        +
      </button>
    </div>
  )
}

function MOTMVoteInput({
  value,
  onChange,
  isLeading,
}: {
  value: number
  onChange: (val: number) => void
  isLeading: boolean
}) {
  return (
    <div className="flex items-center justify-center space-x-1">
      {[0, 1].map((vote) => (
        <button
          key={vote}
          onClick={() => onChange(vote)}
          className={`w-8 h-8 rounded transition-all duration-200 flex items-center justify-center ${
            value >= vote + 1
              ? 'bg-yellow-500/30 border-yellow-400 text-yellow-400'
              : 'bg-black/40 border-stadium-600 text-transparent hover:border-stadium-500'
          } border-2`}
        >
          <Star className={`h-4 w-4 ${value >= vote + 1 ? 'fill-yellow-400' : ''}`} />
        </button>
      ))}
    </div>
  )
}