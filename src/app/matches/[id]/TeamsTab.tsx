'use client'

import { PlayerWithStats, BalancedTeams } from '@/types'
import { Copy, Check, Users, Shirt, ShirtIcon, Zap, TrendingUp, Shield, Target, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { format } from 'date-fns'
import { WhatsAppExport } from '@/components/ui/WhatsAppExport'

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
  matchDate: Date
  opponent: string
  pitchName?: string | null
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
  matchDate,
  opponent,
  pitchName,
}: TeamsTabProps) {
  const [animatingTeams, setAnimatingTeams] = useState(false)
  const [showWhatsAppExport, setShowWhatsAppExport] = useState(false)

  const handleGenerate = () => {
    setAnimatingTeams(true)
    onGenerateTeams()
    setTimeout(() => setAnimatingTeams(false), 800)
  }

  return (
    <div className="space-y-8">
      {/* Control Panel - Brutalist Card */}
      <div className="card relative overflow-hidden">
        {/* Animated top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-cyan-300 to-cyan-500" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Team Size Selector */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <label className="text-sm font-black text-cyan-400/70 uppercase tracking-widest">
                Team Size
              </label>
              <div className="relative group">
                <select
                  value={sideSize}
                  onChange={(e) => setSideSize(Number(e.target.value))}
                  className="select-field w-auto pl-4 pr-10 py-3 bg-black/60 border-2 border-cyan-500/40 text-white font-mono text-xl appearance-none cursor-pointer hover:border-cyan-400 focus:border-cyan-400 transition-all"
                >
                  {[5, 6, 7, 8, 9, 10, 11, 12].map((size) => (
                    <option key={size} value={size} className="bg-stadium-900">
                      {size}v{size}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Zap className="h-5 w-5 text-cyan-400/50" />
                </div>
              </div>
            </div>

            {/* Player Count Indicator */}
            <div className="hidden md:flex items-center space-x-3 px-4 py-2 bg-black/40 border border-cyan-500/20 clip-corner-sm">
              <Users className="h-5 w-5 text-cyan-400/70" />
              <span className="font-mono text-lg">
                <span className={availablePlayers.length >= sideSize * 2 ? 'text-cyan-400' : 'text-red-400'}>
                  {availablePlayers.length}
                </span>
                <span className="text-gray-500 mx-1">/</span>
                <span className="text-gray-400">{sideSize * 2}</span>
              </span>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!canGenerateTeams || animatingTeams}
            className={`btn-primary relative overflow-hidden group ${
              !canGenerateTeams ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700`} />
            <Zap className={`h-5 w-5 mr-2 inline transition-transform ${animatingTeams ? 'animate-pulse' : ''}`} />
            <span className="relative z-10">
              {animatingTeams ? 'Generating...' : 'Generate Teams'}
            </span>
          </button>
        </div>

        {!canGenerateTeams && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 clip-corner-sm">
            <p className="text-red-400 text-sm font-medium">
              Need <span className="font-mono text-red-300">{sideSize * 2}</span> available players to generate teams
              (currently <span className="font-mono text-red-300">{availablePlayers.length}</span>)
            </p>
          </div>
        )}
      </div>

      {/* Generated Teams Display */}
      {generatedTeams && (
        <>
          {/* Balance Score Dashboard */}
          <div className={`card transition-all duration-500 ${animatingTeams ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              {/* Balance Meter */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-6 w-6 text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.6)]" />
                    <span className="text-sm font-black text-cyan-400/70 uppercase tracking-widest">
                      Balance Score
                    </span>
                  </div>
                  <span className={`text-4xl font-black font-mono tabular-nums ${
                    generatedTeams.balancePercentage >= 90 ? 'text-green-400' :
                    generatedTeams.balancePercentage >= 75 ? 'text-yellow-400' : 'text-red-400'
                  }`} style={{
                    textShadow: generatedTeams.balancePercentage >= 90
                      ? '0 0 20px rgba(34,197,94,0.6)'
                      : '0 0 20px rgba(239,68,68,0.6)'
                  }}>
                    {generatedTeams.balancePercentage}%
                  </span>
                </div>

                {/* Visual Balance Bar */}
                <div className="relative h-4 bg-black/60 overflow-hidden clip-corner-sm">
                  <div
                    className="absolute top-0 left-0 h-full transition-all duration-700 ease-out"
                    style={{
                      width: `${(generatedTeams.whiteAvgRating / (generatedTeams.whiteAvgRating + generatedTeams.blackAvgRating)) * 100}%`,
                      background: 'linear-gradient(90deg, #ffffff 0%, #e5e5e5 100%)',
                      boxShadow: '0 0 20px rgba(255,255,255,0.5)'
                    }}
                  />
                  <div
                    className="absolute top-0 right-0 h-full transition-all duration-700 ease-out"
                    style={{
                      width: `${(generatedTeams.blackAvgRating / (generatedTeams.whiteAvgRating + generatedTeams.blackAvgRating)) * 100}%`,
                      background: 'linear-gradient(90deg, #404040 0%, #262626 100%)',
                      boxShadow: '0 0 20px rgba(0,0,0,0.5)'
                    }}
                  />
                </div>

                {/* Team Averages */}
                <div className="flex justify-between mt-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-white border border-gray-300" />
                    <span className="text-gray-400 text-sm">White:</span>
                    <span className="font-mono text-white font-medium">{generatedTeams.whiteAvgRating}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-gray-700 border border-gray-600" />
                    <span className="text-gray-400 text-sm">Black:</span>
                    <span className="font-mono text-white font-medium">{generatedTeams.blackAvgRating}</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Export Button */}
              <button
                onClick={() => setShowWhatsAppExport(true)}
                className="btn-primary min-w-[200px] flex items-center justify-center space-x-2"
              >
                <MessageCircle className="h-5 w-5" />
                <span>WhatsApp Export</span>
              </button>
            </div>
          </div>

          {/* Teams Grid - Formation Style */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* White Team Card */}
            <TeamCard
              team={generatedTeams.white}
              teamName="White"
              teamColor="white"
              borderColor="border-white/30"
              bgGradient="from-white/10 to-gray-500/5"
              iconColor="text-white"
              positions={generatedTeams.whitePositions}
              delay={0}
            />

            {/* Black Team Card */}
            <TeamCard
              team={generatedTeams.black}
              teamName="Black"
              teamColor="black"
              borderColor="border-gray-600/50"
              bgGradient="from-gray-800/50 to-gray-900/30"
              iconColor="text-gray-400"
              positions={generatedTeams.blackPositions}
              delay={100}
            />
          </div>

          {/* Bench Section */}
          {bench.length > 0 && (
            <div className="card">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-stadium-700/50 clip-corner-sm">
                  <Shield className="h-5 w-5 text-gray-400" />
                </div>
                <h3 className="text-lg font-black text-gray-300 uppercase tracking-widest">
                  Bench
                </h3>
                <span className="px-2 py-1 bg-stadium-700/50 text-gray-500 text-xs font-mono">
                  {bench.length}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {bench.map((player, index) => (
                  <div
                    key={player.id}
                    className="group flex items-center justify-between p-3 bg-stadium-800/40 border border-stadium-700/40 clip-corner-sm hover:border-cyan-500/30 hover:bg-stadium-800/60 transition-all duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs text-gray-600">{index + 1}</span>
                      <span className="text-gray-300 font-medium">{player.name}</span>
                    </div>
                    <PositionBadge position={player.primaryPosition} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formation Summary */}
          <div className="grid md:grid-cols-2 gap-6">
            <FormationSummary
              teamName="White"
              color="white"
              positions={generatedTeams.whitePositions}
              totalRating={generatedTeams.whiteRating}
            />
            <FormationSummary
              teamName="Black"
              color="black"
              positions={generatedTeams.blackPositions}
              totalRating={generatedTeams.blackRating}
            />
          </div>
        </>
      )}

      {/* WhatsApp Export Modal */}
      {generatedTeams && (
        <WhatsAppExport
          teams={generatedTeams}
          matchDate={matchDate}
          opponent={opponent}
          pitchName={pitchName}
          sideSize={sideSize}
          balancePercentage={generatedTeams.balancePercentage}
          bench={bench}
          isOpen={showWhatsAppExport}
          onClose={() => setShowWhatsAppExport(false)}
        />
      )}
    </div>
  )
}

function TeamCard({
  team,
  teamName,
  teamColor,
  borderColor,
  bgGradient,
  iconColor,
  positions,
  delay,
}: {
  team: PlayerWithStats[]
  teamName: string
  teamColor: string
  borderColor: string
  bgGradient: string
  iconColor: string
  positions: Record<string, number>
  delay: number
}) {
  return (
    <div
      className={`card bg-gradient-to-br ${bgGradient} border ${borderColor} animate-slide-reveal`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Team Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-current/10">
        <div className="flex items-center space-x-3">
          <div className={`relative`}>
            <div className={`w-5 h-5 rounded-full ${
              teamColor === 'white'
                ? 'bg-white border-2 border-gray-300'
                : 'bg-gray-700 border-2 border-gray-600'
            }`} />
            <div className={`absolute inset-0 rounded-full ${
              teamColor === 'white' ? 'bg-white/30' : 'bg-gray-700/30'
            } blur-md`} />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-wider">
            {teamName} Team
          </h3>
        </div>
        <span className="font-mono text-gray-500">
          {team.length} players
        </span>
      </div>

      {/* Formation Visual - 4-3-3 style arrangement */}
      <div className="space-y-3">
        {team.map((player, index) => (
          <div
            key={player.id}
            className="group flex items-center justify-between p-4 bg-black/40 border border-transparent hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all duration-300 clip-corner-sm"
            style={{ animationDelay: `${delay + index * 100}ms` }}
          >
            <div className="flex items-center space-x-4">
              {/* Jersey Number */}
              <span className={`font-mono text-2xl font-black w-10 ${
                teamColor === 'white' ? 'text-white/30' : 'text-gray-600'
              }`}>
                {index + 1}
              </span>

              {/* Shirt Icon */}
              <div className={`p-2 ${teamColor === 'white' ? 'bg-white/10' : 'bg-gray-700/30'} clip-corner-sm`}>
                <ShirtIcon className={`h-5 w-5 ${iconColor}`} />
              </div>

              {/* Player Name */}
              <div>
                <span className="font-bold text-white uppercase tracking-wide">
                  {player.name}
                </span>
                <div className="flex items-center space-x-2 mt-1">
                  <PositionBadge position={player.primaryPosition} />
                  <span className="text-xs text-gray-500">
                    Rating: <span className="text-cyan-400/70 font-mono">{player.compositeRating.toFixed(1)}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Rating Badge */}
            <div className="hidden sm:flex flex-col items-end">
              <span className={`font-mono text-xl font-black ${
                teamColor === 'white' ? 'text-white' : 'text-gray-300'
              }`}>
                {player.compositeRating.toFixed(1)}
              </span>
              <span className="text-xs text-gray-500 uppercase">Rating</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FormationSummary({
  teamName,
  color,
  positions,
  totalRating,
}: {
  teamName: string
  color: string
  positions: Record<string, number>
  totalRating: number
}) {
  return (
    <div className="card bg-stadium-800/30 border-stadium-700/50">
      <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">
        {teamName} Formation
      </h4>
      <div className="flex items-center space-x-4">
        {/* Position Bars */}
        <div className="flex-1 space-y-2">
          {(['GK', 'DEF', 'MID', 'FWD'] as const).map((pos) => (
            <div key={pos} className="flex items-center space-x-3">
              <span className={`font-mono text-xs w-8 ${
                pos === 'GK' ? 'text-yellow-400' :
                pos === 'DEF' ? 'text-blue-400' :
                pos === 'MID' ? 'text-green-400' : 'text-red-400'
              }`}>
                {pos}
              </span>
              <div className="flex-1 h-2 bg-black/60 overflow-hidden clip-corner-sm">
                <div
                  className={`h-full ${
                    pos === 'GK' ? 'bg-yellow-400/60' :
                    pos === 'DEF' ? 'bg-blue-400/60' :
                    pos === 'MID' ? 'bg-green-400/60' : 'bg-red-400/60'
                  }`}
                  style={{ width: `${(positions[pos] / 4) * 100}%` }}
                />
              </div>
              <span className="font-mono text-xs text-gray-500 w-4">{positions[pos]}</span>
            </div>
          ))}
        </div>
        <div className="text-right">
          <div className="font-mono text-2xl font-black text-cyan-400">
            {totalRating.toFixed(0)}
          </div>
          <div className="text-xs text-gray-500 uppercase">Total</div>
        </div>
      </div>
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
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-black uppercase tracking-wider clip-corner-sm ${
      badges[position] || 'bg-stadium-700 text-gray-400 border border-stadium-600'
    }`}>
      {position}
    </span>
  )
}
