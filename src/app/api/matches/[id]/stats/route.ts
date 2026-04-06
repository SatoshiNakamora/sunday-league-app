import { NextRequest, NextResponse } from 'next/server'
import { saveMatchStats } from '@/app/actions/matches'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { stats } = await request.json()
    
    await saveMatchStats(params.id, stats)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[stats] Failed to save stats:', error)
    return NextResponse.json(
      { error: 'Failed to save stats' },
      { status: 500 }
    )
  }
}
