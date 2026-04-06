'use client'

import { PlayerWithStats, BalancedTeams } from '@/types'
import { Copy, Check, Users, Shirt, ShirtIcon } from 'lucide-react'

interface TeamsTabProps {
  availablePlayers: PlayerWithStats[]
  sideSize: number
  setSideSize: (size: number) => void
  canGenerateTeams: boolean
  generatedTeams: BalancedTeams | null
  bench: PlayerWithStats[]
  onGenerateTeams: () => void
  copied: boolean
  onCopy: () => void
}

export function TeamsTab({
  availablePlayers,
  sideSize,
  setSideSize,
  canGenerateTeams,
  generatedTeams,
  bench,
  onGenerateTeams,
  copied,
  onCopy,
}: TeamsTabProps) {
  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-300">Team Size:</label>
            <select
              value={sideSize}
              onChange={(e) => setSideSize(Number(e.target.value))}
              className="select-field w-auto"
            >
              {[5, 6, 7, 8, 9, 10, 11, 12].map((size) => (
                <option key={size} value={size}>
                  {size}v{size}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onGenerateTeams}
            disabled={!canGenerateTeams}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Users className="h-4 w-4 mr-2 inline" />
            Generate Teams
          </button>
        </div>

        {!canGenerateTeams && (
          <p className="text-gray-500 text-sm mt-3">
            Need at least {sideSize * 2} available players to generate teams (currently {availablePlayers.length})
          </p>
        )}
      </div>

      {/* Generated Teams */}
      {generatedTeams && (
        <>
          {/* Balance Score */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-400">Balance Score</h3>
                <p className="text-3xl font-bold text-white mt-1">{generatedTeams.balancePercentage}%</p>
              </div>
              <button
                onClick={onCopy}
                className="btn-secondary flex items-center space-x-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-pitch-400" />
                    <span className="text-pitch-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy for WhatsApp</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Teams Display */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* White Team */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-300"></div>
                  <span>White Team</span>
                </h3>
                <span className="text-sm text-gray-400">
                  Avg: <span className="text-white font-medium">{generatedTeams.whiteAvgRating}</span>
                </span>
              </div>
              <div className="space-y-2">
                {generatedTeams.white.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center space-x-3">
                      <ShirtIcon className="h-5 w-5 text-white" />
                      <span className="font-medium text-white">{player.name}</span>
                    </div>
                    <PositionBadge position={player.primaryPosition} />
                  </div>
                ))}
              </div>
            </div>

            {/* Black Team */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-gray-800 border-2 border-gray-600"></div>
                  <span>Black Team</span>
                </h3>
                <span className="text-sm text-gray-400">
                  Avg: <span className="text-white font-medium">{generatedTeams.blackAvgRating}</span>
                </span>
              </div>
              <div className="space-y-2">
                {generatedTeams.black.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700/50"
                  >
                    <div className="flex items-center space-x-3">
                      <ShirtIcon className="h-5 w-5 text-gray-400" />
                      <span className="font-medium text-white">{player.name}</span>
                    </div>
                    <PositionBadge position={player.primaryPosition} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bench */}
          {bench.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Bench</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {bench.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-stadium-800/50 border border-stadium-700/50"
                  >
                    <span className="text-gray-300 text-sm">{player.name}</span>
                    <PositionBadge position={player.primaryPosition} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function PositionBadge({ position }: { position: string }) {
  const badges: Record<string, string> = {
    GK: 'badge-gk',
    DEF: 'badge-def',
    MID: 'badge-mid',
    FWD: 'badge-fwd',
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${badges[position] || 'bg-stadium-800 text-gray-400 border-stadium-700'}`}>
      {position}
    </span>
  )
}