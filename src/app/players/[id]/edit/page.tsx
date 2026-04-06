import Navigation from '@/components/Navigation'
import { getPlayer, updatePlayer } from '@/app/actions/players'
import { Position, Foot } from '@/types'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface PageProps {
  params: { id: string }
}

export default async function EditPlayerPage({ params }: PageProps) {
  const player = await getPlayer(params.id)
  
  if (!player) {
    notFound()
  }

  async function handleSubmit(formData: FormData) {
    'use server'

    const name = formData.get('name')?.toString().trim()
    const whatsappName = formData.get('whatsappName')?.toString().trim()
    const primaryPosition = formData.get('primaryPosition')?.toString()
    const secondaryPosition = formData.get('secondaryPosition')?.toString()
    const foot = formData.get('foot')?.toString()

    const validPositions: Position[] = ['GK', 'DEF', 'MID', 'FWD']
    const validFeet: Foot[] = ['LEFT', 'RIGHT', 'BOTH']

    if (!name || name.length > 100) return
    if (!primaryPosition || !validPositions.includes(primaryPosition as Position)) return

    await updatePlayer(params.id, {
      name,
      whatsappName: whatsappName || undefined,
      primaryPosition: primaryPosition as Position,
      secondaryPosition:
        secondaryPosition && validPositions.includes(secondaryPosition as Position)
          ? (secondaryPosition as Position)
          : undefined,
      foot: foot && validFeet.includes(foot as Foot) ? (foot as Foot) : undefined,
    })

    redirect('/players')
  }

  return (
    <>
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/players"
            className="text-gray-600 hover:text-gray-900 flex items-center space-x-1 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Players</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Player</h1>
        </div>

        <div className="card max-w-2xl">
          <form action={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                defaultValue={player.name}
                className="input-field"
                placeholder="Enter player's full name"
              />
            </div>

            <div>
              <label htmlFor="whatsappName" className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp Display Name
              </label>
              <input
                type="text"
                id="whatsappName"
                name="whatsappName"
                defaultValue={player.whatsappName || ''}
                className="input-field"
                placeholder="Name as it appears in WhatsApp (optional)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="primaryPosition" className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Position *
                </label>
                <select
                  id="primaryPosition"
                  name="primaryPosition"
                  required
                  defaultValue={player.primaryPosition}
                  className="input-field"
                >
                  <option value="GK">Goalkeeper (GK)</option>
                  <option value="DEF">Defender (DEF)</option>
                  <option value="MID">Midfielder (MID)</option>
                  <option value="FWD">Forward (FWD)</option>
                </select>
              </div>

              <div>
                <label htmlFor="secondaryPosition" className="block text-sm font-medium text-gray-700 mb-1">
                  Secondary Position
                </label>
                <select
                  id="secondaryPosition"
                  name="secondaryPosition"
                  defaultValue={player.secondaryPosition || ''}
                  className="input-field"
                >
                  <option value="">None</option>
                  <option value="GK">Goalkeeper (GK)</option>
                  <option value="DEF">Defender (DEF)</option>
                  <option value="MID">Midfielder (MID)</option>
                  <option value="FWD">Forward (FWD)</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="foot" className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Foot
              </label>
              <select
                id="foot"
                name="foot"
                defaultValue={player.foot || ''}
                className="input-field"
              >
                <option value="">Unknown</option>
                <option value="LEFT">Left</option>
                <option value="RIGHT">Right</option>
                <option value="BOTH">Both</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Link
                href="/players"
                className="btn-secondary"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="btn-primary"
              >
                Update Player
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  )
}
