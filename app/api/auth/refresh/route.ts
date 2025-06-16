import { NextRequest, NextResponse } from 'next/server'
import { verifySessionFromRequest, createSession, createSessionResponse } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const user = await verifySessionFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    // Create a new token with extended expiration
    const newToken = await createSession(user)
    
    return createSessionResponse({
      success: true,
      message: 'Session refreshed',
      user
    }, newToken)
    
  } catch (error) {
    console.error('Session refresh error:', error)
    return NextResponse.json(
      { error: 'Failed to refresh session' },
      { status: 500 }
    )
  }
}