'use client'

import { Trash2 } from 'lucide-react'

interface DeletePlayerButtonProps {
  playerId: string
  deletePlayerAction: (id: string) => Promise<void>
}

export default function DeletePlayerButton({ playerId, deletePlayerAction }: DeletePlayerButtonProps) {
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this player? This will also remove them from all matches.')) {
      return
    }

    try {
      await deletePlayerAction(playerId)
      window.location.reload()
    } catch (error) {
      console.error('Failed to delete player:', error)
      alert('Failed to delete player. Please try again.')
    }
  }

  return (
    <button
      onClick={handleDelete}
      title="Delete player"
      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all rounded-lg"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  )
}