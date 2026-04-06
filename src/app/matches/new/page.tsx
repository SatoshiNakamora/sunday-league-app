import Navigation from '@/components/Navigation'
import { createMatch } from '@/app/actions/matches'
import { getPlayerStats } from '@/app/actions/dashboard'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function NewMatchPage() {
  const players = await getPlayerStats()

  async function handleSubmit(formData: FormData) {
    'use server'

    const opponent = formData.get('opponent') as string
    const date = formData.get('date') as string
    const time = formData.get('time') as string
    const pitchName = formData.get('pitchName') as string
    const sideSize = parseInt(formData.get('sideSize') as string)
    const selectedPlayers = formData.getAll('players') as string[]

    const dateTime = new Date(`${date}T${time}`)

    await createMatch({
      opponent,
      date: dateTime,
      pitchName: pitchName || undefined,
      sideSize,
      playerIds: selectedPlayers,
    })

    redirect('/matches')
  }

  return (
    <>
      <Navigation />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/matches"
          className="text-gray-500 hover:text-pitch-400 flex items-center space-x-1 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Matches</span>
        </Link>

        <div className="card">
          <h1 className="text-2xl font-bold text-white mb-6">Schedule New Match</h1>

          <form action={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="opponent" className="form-label">Opponent *</label>
              <input
                type="text"
                id="opponent"
                name="opponent"
                required
                className="input-field"
                placeholder="Enter opponent name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="form-label">Date *</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="time" className="form-label">Time *</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  required
                  defaultValue="10:00"
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label htmlFor="pitchName" className="form-label">Pitch / Venue</label>
              <input
                type="text"
                id="pitchName"
                name="pitchName"
                className="input-field"
                placeholder="Enter pitch name or venue"
              />
            </div>

            <div>
              <label htmlFor="sideSize" className="form-label">Team Size *</label>
              <select
                id="sideSize"
                name="sideSize"
                required
                className="select-field"
              >
                <option value="5">5v5</option>
                <option value="6">6v6</option>
                <option value="7">7v7</option>
                <option value="8" selected>8v8</option>
                <option value="9">9v9</option>
                <option value="10">10v10</option>
                <option value="11">11v11</option>
                <option value="12">12v12</option>
              </select>
            </div>

            <div>
              <label className="form-label">Select Players</label>
              <div className="mt-2 max-h-64 overflow-y-auto border border-stadium-700 rounded-lg p-3 space-y-2">
                {players.length === 0 ? (
                  <p className="text-gray-500 text-sm">No players available. Add players first.</p>
                ) : (
                  players.map((player) => (
                    <label
                      key={player.id}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-stadium-800 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        name="players"
                        value={player.id}
                        defaultChecked
                        className="checkbox-field rounded"
                      />
                      <span className="text-white">{player.name}</span>
                      <span className="text-xs text-gray-500">({player.primaryPosition})</span>
                    </label>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Link href="/matches" className="btn-secondary">
                Cancel
              </Link>
              <button type="submit" className="btn-primary">
                Create Match
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  )
}