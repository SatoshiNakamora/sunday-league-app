import Navigation from '@/components/Navigation'
import { getPlayers, deletePlayer } from '@/app/actions/players'
import Link from 'next/link'
import { Plus, Edit, User, Users } from 'lucide-react'
import DeletePlayerButton from '@/components/DeletePlayerButton'

export default async function PlayersPage() {
  const players = await getPlayers()

  return (
    <>
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="page-title">Players</h1>
            <p className="page-subtitle">Manage your squad</p>
          </div>
          <Link
            href="/players/new"
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Player</span>
          </Link>
        </div>

        <div className="table-container">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">
                  Player
                </th>
                <th className="table-header-cell">
                  Position
                </th>
                <th className="table-header-cell">
                  Foot
                </th>
                <th className="table-header-cell text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="table-body">
              {players.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Users className="h-10 w-10 text-gray-600" />
                      <p className="text-gray-400 font-medium">No players yet</p>
                      <p className="text-gray-600 text-sm">Add your squad to start managing matches and stats.</p>
                      <Link href="/players/new" className="btn-primary text-sm mt-1">
                        Add Your First Player
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                players.map((player) => (
                  <tr key={player.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-lg bg-pitch-500/20 flex items-center justify-center mr-3">
                          <User className="h-5 w-5 text-pitch-400" />
                        </div>
                        <div>
                          <div className="font-medium text-white">{player.name}</div>
                          {player.whatsappName && (
                            <div className="text-sm text-gray-500">{player.whatsappName}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <PositionBadge position={player.primaryPosition} />
                        {player.secondaryPosition && (
                          <>
                            <span className="text-gray-600">/</span>
                            <PositionBadge position={player.secondaryPosition} secondary />
                          </>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm text-gray-400">
                        {player.foot || '-'}
                      </span>
                    </td>
                    <td className="table-cell text-right">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/players/${player.id}/edit`}
                          title="Edit player"
                          className="p-2 text-gray-500 hover:text-pitch-400 transition-colors rounded-lg hover:bg-stadium-800"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <DeletePlayerButton
                          playerId={player.id}
                          deletePlayerAction={deletePlayer}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  )
}

function PositionBadge({
  position,
  secondary = false,
}: {
  position: string
  secondary?: boolean
}) {
  const badges: Record<string, string> = {
    GK: 'badge-gk',
    DEF: 'badge-def',
    MID: 'badge-mid',
    FWD: 'badge-fwd',
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        secondary ? 'bg-stadium-700 text-gray-400 border-stadium-600' : badges[position] || 'bg-stadium-800 text-gray-400 border-stadium-700'
      }`}
    >
      {position}
    </span>
  )
}