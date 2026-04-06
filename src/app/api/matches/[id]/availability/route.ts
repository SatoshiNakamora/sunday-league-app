import { NextRequest, NextResponse } from 'next/server'
import { updatePlayerAvailability } from '@/app/actions/matches'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData()
    const playerId = formData.get('playerId')?.toString()
    const isAvailableStr = formData.get('isAvailable')?.toString()

    if (!playerId || isAvailableStr === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const isAvailable = isAvailableStr === 'true'
    await updatePlayerAvailability(params.id, playerId, isAvailable)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[availability] Failed to update availability:', error)
    return NextResponse.json(
      { error: 'Failed to update availability' },
      { status: 500 }
    )
  }
}
