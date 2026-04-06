import Navigation from '@/components/Navigation'
import { createPlayer } from '@/app/actions/players'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewPlayerPage() {
  async function handleSubmit(formData: FormData) {
    'use server'

    const name = formData.get('name') as string
    const whatsappName = formData.get('whatsappName') as string
    const primaryPosition = formData.get('primaryPosition') as string
    const secondaryPosition = formData.get('secondaryPosition') as string
    const foot = formData.get('foot') as string

    await createPlayer({
      name,
      whatsappName: whatsappName || undefined,
      primaryPosition: primaryPosition as any,
      secondaryPosition: (secondaryPosition as any) || undefined,
      foot: (foot as any) || undefined,
    })

    redirect('/players')
  }

  return (
    <>
      <Navigation />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/players"
          className="text-gray-500 hover:text-pitch-400 flex items-center space-x-1 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Players</span>
        </Link>

        <div className="card">
          <h1 className="text-2xl font-bold text-white mb-6">Add New Player</h1>

          <form action={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="form-label">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="input-field"
                placeholder="Enter player name"
              />
            </div>

            <div>
              <label htmlFor="whatsappName" className="form-label">WhatsApp Name</label>
              <input
                type="text"
                id="whatsappName"
                name="whatsappName"
                className="input-field"
                placeholder="Name as it appears on WhatsApp"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="primaryPosition" className="form-label">Primary Position *</label>
                <select
                  id="primaryPosition"
                  name="primaryPosition"
                  required
                  className="select-field"
                >
                  <option value="">Select position</option>
                  <option value="GK">GK - Goalkeeper</option>
                  <option value="DEF">DEF - Defender</option>
                  <option value="MID">MID - Midfielder</option>
                  <option value="FWD">FWD - Forward</option>
                </select>
              </div>

              <div>
                <label htmlFor="secondaryPosition" className="form-label">Secondary Position</label>
                <select
                  id="secondaryPosition"
                  name="secondaryPosition"
                  className="select-field"
                >
                  <option value="">None</option>
                  <option value="GK">GK - Goalkeeper</option>
                  <option value="DEF">DEF - Defender</option>
                  <option value="MID">MID - Midfielder</option>
                  <option value="FWD">FWD - Forward</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="foot" className="form-label">Preferred Foot</label>
              <select
                id="foot"
                name="foot"
                className="select-field"
              >
                <option value="">Select foot</option>
                <option value="LEFT">Left</option>
                <option value="RIGHT">Right</option>
                <option value="BOTH">Both</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Link href="/players" className="btn-secondary">
                Cancel
              </Link>
              <button type="submit" className="btn-primary">
                Add Player
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  )
}