'use client'

import { Trash2 } from 'lucide-react'

interface DeleteMatchButtonProps {
  matchId: string
  deleteMatchAction: (id: string) => Promise<void>
}

export default function DeleteMatchButton({ matchId, deleteMatchAction }: DeleteMatchButtonProps) {
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this match? This action cannot be undone.')) {
      return
    }

    try {
      await deleteMatchAction(matchId)
      window.location.reload()
    } catch (error) {
      console.error('Failed to delete match:', error)
      alert('Failed to delete match. Please try again.')
    }
  }

  return (
    <button
      onClick={handleDelete}
      title="Delete match"
      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all rounded-lg"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  )
}