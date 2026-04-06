import Navigation from '@/components/Navigation'
import { getMatches, deleteMatch } from '@/app/actions/matches'
import { getPlayerStats } from '@/app/actions/dashboard'
import Link from 'next/link'
import { Plus, Calendar, MapPin, Users } from 'lucide-react'
import DeleteMatchButton from '@/components/DeleteMatchButton'
import { format } from 'date-fns'

export default async function MatchesPage() {
  const matches = await getMatches()
  const players = await getPlayerStats()

  return (
    <>
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="page-title">Matches</h1>
            <p className="page-subtitle">Schedule and manage fixtures</p>
          </div>
          <Link
            href="/matches/new"
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Match</span>
          </Link>
        </div>

        <div className="space-y-4">
          {matches.length === 0 ? (
            <div className="card text-center py-12">
              <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No matches scheduled yet.</p>
              <p className="text-gray-600 text-sm mt-1">Create your first match to get started.</p>
            </div>
          ) : (
            matches.map((match) => {
              const availableCount = match.matchPlayers.filter(mp => mp.isAvailable).length

              return (
                <div key={match.id} className="card hover:border-pitch-500/30 transition-all">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          vs {match.opponent}
                        </h3>
                        {match.isComplete && (
                          <span className="px-2 py-1 text-xs font-medium badge-success rounded-full">
                            Completed
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(match.date), 'EEEE, d MMMM yyyy')}</span>
                        </div>

                        {match.pitchName && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{match.pitchName}</span>
                          </div>
                        )}

                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{match.sideSize}v{match.sideSize}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 mt-4 md:mt-0">
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Available</div>
                        <div className="text-lg font-semibold text-pitch-400">
                          {availableCount}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/matches/${match.id}`}
                          className="btn-secondary text-sm"
                        >
                          Manage
                        </Link>

                        <DeleteMatchButton
                          matchId={match.id}
                          deleteMatchAction={deleteMatch}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </main>
    </>
  )
}