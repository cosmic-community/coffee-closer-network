import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getUserProfileById } from '@/lib/cosmic-profile'

export async function GET(request: NextRequest) {
  try {
    const user = await getSession()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const profile = await getUserProfileById(user.id)
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      profile
    })

  } catch (error: any) {
    console.error('Profile retrieval error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve profile' },
      { status: 500 }
    )
  }
}