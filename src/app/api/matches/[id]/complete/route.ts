import { NextRequest, NextResponse } from 'next/server'
import { completeMatch } from '@/app/actions/matches'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await completeMatch(params.id)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[complete] Failed to complete match:', error)
    return NextResponse.json(
      { error: 'Failed to complete match' },
      { status: 500 }
    )
  }
}
