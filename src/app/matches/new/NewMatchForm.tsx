'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createMatch } from '@/app/actions/matches'
import { PlayerWithStats } from '@/types'
import { VenueSearch } from '@/components/ui/VenueSearch'

interface NewMatchFormProps {
  players: PlayerWithStats[]
}

export function NewMatchForm({ players }: NewMatchFormProps) {
  const router = useRouter()
  const [opponent, setOpponent] = useState('Friendly')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('10:00')
  const [pitchName, setPitchName] = useState('')
  const [sideSize, setSideSize] = useState(8)
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>(
    players.map(p => p.id)
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !time) return

    setIsSubmitting(true)
    try {
      const dateTime = new Date(`${date}T${time}`)

      await createMatch({
        opponent,
        date: dateTime,
        pitchName: pitchName || undefined,
        sideSize,
        playerIds: selectedPlayers,
      })

      router.push('/matches')
      router.refresh()
    } catch (error) {
      console.error('Failed to create match:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePlayer = (playerId: string) => {
    setSelectedPlayers(prev =>
      prev.includes(playerId)
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Opponent */}
      <div>
        <label htmlFor="opponent" className="form-label">Opponent *</label>
        <input
          type="text"
          id="opponent"
          value={opponent}
          onChange={(e) => setOpponent(e.target.value)}
          required
          className="input-field"
          placeholder="Enter opponent name"
        />
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="form-label">Date *</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="time" className="form-label">Time *</label>
          <input
            type="time"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            defaultValue="10:00"
            className="input-field"
          />
        </div>
      </div>

      {/* Pitch / Venue with Search */}
      <div>
        <label htmlFor="pitchName" className="form-label">Pitch / Venue</label>
        <VenueSearch value={pitchName} onChange={setPitchName} />
      </div>

      {/* Team Size */}
      <div>
        <label htmlFor="sideSize" className="form-label">Team Size *</label>
        <select
          id="sideSize"
          value={sideSize}
          onChange={(e) => setSideSize(parseInt(e.target.value))}
          required
          className="select-field"
        >
          <option value="5">5v5</option>
          <option value="6">6v6</option>
          <option value="7">7v7</option>
          <option value="8">8v8</option>
          <option value="9">9v9</option>
          <option value="10">10v10</option>
          <option value="11">11v11</option>
          <option value="12">12v12</option>
        </select>
      </div>

      {/* Select Players */}
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
                  checked={selectedPlayers.includes(player.id)}
                  onChange={() => togglePlayer(player.id)}
                  className="checkbox-field rounded"
                />
                <span className="text-white">{player.name}</span>
                <span className="text-xs text-gray-500">({player.primaryPosition})</span>
              </label>
            ))
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end space-x-3 pt-4">
        <Link href="/matches" className="btn-secondary">
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Match'}
        </button>
      </div>
    </form>
  )
}