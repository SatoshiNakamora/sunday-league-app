'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import { Match, MatchPlayer, Player, PlayerWithStats, BalancedTeams } from '@/types'
import { generateBalancedTeams, exportTeamsToText } from '@/lib/teamBalancer'
import Navigation from '@/components/Navigation'
import { useToast, ToastDisplay } from '@/components/ui/Toast'
import { AvailabilityTab } from './AvailabilityTab'
import { TeamsTab } from './TeamsTab'
import { StatsTab } from './StatsTab'

interface MatchDetail extends Match {
  matchPlayers: (MatchPlayer & { player: Player })[]
}

interface ClientMatchPageProps {
  match: MatchDetail
  availablePlayers: PlayerWithStats[]
  matchId: string
}

type Tab = 'availability' | 'teams' | 'stats'

export default function ClientMatchPage({ match, availablePlayers, matchId }: ClientMatchPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>('availability')
  const [generatedTeams, setGeneratedTeams] = useState<BalancedTeams | null>(null)
  const [bench, setBench] = useState<PlayerWithStats[]>([])
  const [copied, setCopied] = useState(false)
  const [sideSize, setSideSize] = useState(match.sideSize)
  const { toast, showToast } = useToast()

  const availableCount = match.matchPlayers.filter((mp) => mp.isAvailable).length
  const canGenerateTeams = availablePlayers.length >= sideSize * 2

  const handleGenerateTeams = () => {
    try {
      const { teams, bench: benchPlayers } = generateBalancedTeams(availablePlayers, sideSize)
      setGeneratedTeams(teams)
      setBench(benchPlayers)
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to generate teams',
        'error',
      )
    }
  }

  const handleCopyToClipboard = async () => {
    if (!generatedTeams) return
    const text = exportTeamsToText(generatedTeams, true)
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/matches"
            className="text-gray-500 hover:text-pitch-400 flex items-center space-x-1 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Matches</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">vs {match.opponent}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-gray-400">
                <span>{format(new Date(match.date), 'EEEE, d MMMM yyyy @ h:mm a')}</span>
                {match.pitchName && <span>• {match.pitchName}</span>}
                <span>• {match.sideSize}v{match.sideSize}</span>
              </div>
            </div>

            {match.isComplete && (
              <span className="mt-4 md:mt-0 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium badge-success">
                <CheckCircle className="h-4 w-4 mr-1" />
                Match Complete
              </span>
            )}
          </div>
        </div>

        <ToastDisplay toast={toast} />

        {/* Tabs */}
        <div className="border-b border-stadium-700 mb-6">
          <nav className="-mb-px flex space-x-8">
            <TabButton
              active={activeTab === 'availability'}
              onClick={() => setActiveTab('availability')}
              label="Availability"
              count={availableCount}
            />
            <TabButton
              active={activeTab === 'teams'}
              onClick={() => setActiveTab('teams')}
              label="Generate Teams"
            />
            <TabButton
              active={activeTab === 'stats'}
              onClick={() => setActiveTab('stats')}
              label="Match Stats"
            />
          </nav>
        </div>

        {activeTab === 'availability' && (
          <AvailabilityTab match={match} matchId={matchId} />
        )}

        {activeTab === 'teams' && (
          <TeamsTab
            availablePlayers={availablePlayers}
            sideSize={sideSize}
            setSideSize={setSideSize}
            canGenerateTeams={canGenerateTeams}
            generatedTeams={generatedTeams}
            bench={bench}
            onGenerateTeams={handleGenerateTeams}
            copied={copied}
            onCopy={handleCopyToClipboard}
          />
        )}

        {activeTab === 'stats' && (
          <StatsTab match={match} matchId={matchId} generatedTeams={generatedTeams} />
        )}
      </main>
    </>
  )
}

function TabButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean
  onClick: () => void
  label: string
  count?: number
}) {
  return (
    <button
      onClick={onClick}
      className={`tab-button ${
        active ? 'tab-button-active' : 'tab-button-inactive'
      }`}
    >
      {label}
      {count !== undefined && (
        <span
          className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
            active ? 'bg-pitch-500/20 text-pitch-400' : 'bg-stadium-800 text-gray-500'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  )
}