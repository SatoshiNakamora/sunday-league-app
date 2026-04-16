import Navigation from '@/components/Navigation'
import { getPlayerStats } from '@/app/actions/dashboard'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { NewMatchForm } from './NewMatchForm'

export default async function NewMatchPage() {
  const players = await getPlayerStats()

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

          <NewMatchForm players={players} />
        </div>
      </main>
    </>
  )
}