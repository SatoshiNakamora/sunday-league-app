'use client'

import { useState } from 'react'
import { updatePlayerAvailability } from '@/app/actions/matches'
import { Player } from '@/types'
import { User, Check, X } from 'lucide-react'

interface MatchPlayer {
  id: string
  playerId: string
  isAvailable: boolean
  player: Player
}

interface AvailabilityTabProps {
  match: {
    id: string
    matchPlayers: MatchPlayer[]
  }
  matchId: string
}

export function AvailabilityTab({ match, matchId }: AvailabilityTabProps) {
  const [updating, setUpdating] = useState<string | null>(null)

  const handleToggle = async (matchPlayerId: string, currentStatus: boolean) => {
    setUpdating(matchPlayerId)
    try {
      const mp = match.matchPlayers.find(m => m.id === matchPlayerId)
      if (mp) {
        await updatePlayerAvailability(matchId, mp.playerId, !currentStatus)
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to update availability:', error)
    } finally {
      setUpdating(null)
    }
  }

  const availablePlayers = match.matchPlayers.filter(mp => mp.isAvailable)
  const unavailablePlayers = match.matchPlayers.filter(mp => !mp.isAvailable)

  return (
    <div className="space-y-6">
      {/* Available Players */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-pitch-500"></span>
          <span>Available ({availablePlayers.length})</span>
        </h3>
        {availablePlayers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {availablePlayers.map((mp) => (
              <div
                key={mp.id}
                className="flex items-center justify-between p-4 rounded-xl bg-stadium-800/50 border border-stadium-700/50 hover:border-pitch-500/30 transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-lg bg-pitch-500/20 flex items-center justify-center">
                    <User className="h-5 w-5 text-pitch-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{mp.player.name}</div>
                    <div className="text-xs text-gray-500">{mp.player.primaryPosition}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(mp.id, mp.isAvailable)}
                  disabled={updating === mp.id}
                  className="p-2 rounded-lg bg-pitch-500/20 text-pitch-400 hover:bg-pitch-500/30 transition-all disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No players marked as available</p>
        )}
      </div>

      {/* Unavailable Players */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          <span>Unavailable ({unavailablePlayers.length})</span>
        </h3>
        {unavailablePlayers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {unavailablePlayers.map((mp) => (
              <div
                key={mp.id}
                className="flex items-center justify-between p-4 rounded-xl bg-stadium-800/30 border border-stadium-700/30 opacity-60 hover:opacity-80 transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-lg bg-stadium-700 flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-400">{mp.player.name}</div>
                    <div className="text-xs text-gray-600">{mp.player.primaryPosition}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(mp.id, mp.isAvailable)}
                  disabled={updating === mp.id}
                  className="p-2 rounded-lg bg-stadium-700 text-gray-500 hover:bg-red-500/20 hover:text-red-400 transition-all disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">All players are available</p>
        )}
      </div>
    </div>
  )
}