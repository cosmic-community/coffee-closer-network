import { NextRequest, NextResponse } from 'next/server'
import { getCoffeeChatSessions } from '@/lib/cosmic'
import { getSession } from '@/lib/session'
import type { CoffeeChatSession } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const user = await getSession()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get all coffee chat sessions
    const allSessions = await getCoffeeChatSessions()
    
    // Filter sessions for the current user
    const userSessions = allSessions.filter((session: CoffeeChatSession) => {
      return session.metadata.user_1?.id === user.id || 
             session.metadata.user_2?.id === user.id
    })

    // Sort by scheduled datetime (most recent first)
    userSessions.sort((a, b) => {
      const dateA = new Date(a.metadata.scheduled_datetime || '')
      const dateB = new Date(b.metadata.scheduled_datetime || '')
      return dateB.getTime() - dateA.getTime()
    })

    return NextResponse.json({
      success: true,
      sessions: userSessions,
      total: userSessions.length
    })

  } catch (error: any) {
    console.error('Error fetching user sessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSession()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const sessionData = await request.json()
    
    // Validate required fields
    if (!sessionData.participant_id || !sessionData.scheduled_datetime) {
      return NextResponse.json(
        { error: 'Participant ID and scheduled datetime are required' },
        { status: 400 }
      )
    }

    // TODO: Implement session creation logic
    // This would typically involve:
    // 1. Creating a new coffee-chat-session object in Cosmic
    // 2. Generating meeting link
    // 3. Sending notifications to both participants
    
    return NextResponse.json(
      { error: 'Session creation not yet implemented' },
      { status: 501 }
    )

  } catch (error: any) {
    console.error('Error creating session:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}