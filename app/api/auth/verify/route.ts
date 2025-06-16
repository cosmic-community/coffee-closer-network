import { NextRequest, NextResponse } from 'next/server'
import { verifySessionFromRequest } from '@/lib/session'

export async function GET(request: NextRequest) {
  try {
    const user = await verifySessionFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    return NextResponse.json({ user })
  } catch (error) {
    console.error('Session verification error:', error)
    return NextResponse.json(
      { error: 'Session verification failed' },
      { status: 500 }
    )
  }
}