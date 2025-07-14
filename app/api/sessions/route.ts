import { NextResponse } from 'next/server'
import { getCoffeeChatSessions } from '@/lib/cosmic'

export async function GET() {
  try {
    // Get all coffee chat sessions
    const sessions = await getCoffeeChatSessions()
    
    // Transform the sessions data to include user information
    const transformedSessions = sessions.map((session: any) => {
      const user1 = session.metadata?.user_1
      const user2 = session.metadata?.user_2
      
      return {
        id: session.id,
        title: session.title,
        slug: session.slug,
        scheduled_datetime: session.metadata?.scheduled_datetime,
        status: session.metadata?.status,
        meeting_link: session.metadata?.meeting_link,
        icebreaker_question: session.metadata?.icebreaker_question,
        user_1: user1 ? {
          id: user1.id,
          name: user1.metadata?.full_name || user1.title,
          role: user1.metadata?.current_role,
          company: user1.metadata?.company,
          profile_picture: user1.metadata?.profile_picture?.imgix_url
        } : null,
        user_2: user2 ? {
          id: user2.id,
          name: user2.metadata?.full_name || user2.title,
          role: user2.metadata?.current_role,
          company: user2.metadata?.company,
          profile_picture: user2.metadata?.profile_picture?.imgix_url
        } : null,
        created_at: session.created_at,
        modified_at: session.modified_at
      }
    })
    
    // Sort by scheduled datetime (most recent first)
    const sortedSessions = transformedSessions.sort((a: any, b: any) => {
      const dateA = new Date(a.scheduled_datetime || 0).getTime()
      const dateB = new Date(b.scheduled_datetime || 0).getTime()
      return dateB - dateA
    })
    
    return NextResponse.json({
      sessions: sortedSessions,
      total: sortedSessions.length
    })
  } catch (error) {
    console.error('Error fetching coffee chat sessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch coffee chat sessions' },
      { status: 500 }
    )
  }
}