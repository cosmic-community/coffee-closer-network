import { cosmicWrite } from '@/lib/cosmic'
import type { CoffeeChatSession, UserProfile } from '@/types'

export interface SessionData {
  user_1: string // User Profile ID
  user_2: string // User Profile ID
  scheduled_datetime: string
  status: 'SCHEDULED' | 'COMPLETED' | 'NEEDS_RESCHEDULE' | 'CANCELLED'
  meeting_link?: string
  icebreaker_question?: string
  internal_notes?: string
}

export async function getUserSessions(userId: string): Promise<CoffeeChatSession[]> {
  try {
    const response = await cosmicWrite.objects
      .find({ type: 'coffee-chat-sessions' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)

    if (!response.objects || response.objects.length === 0) {
      return []
    }

    // Filter sessions where the user is a participant
    const userSessions = response.objects.filter((session: any) => 
      session.metadata?.user_1?.id === userId || 
      session.metadata?.user_2?.id === userId
    )

    return userSessions as CoffeeChatSession[]
  } catch (error) {
    console.error('Error fetching user sessions:', error)
    if ((error as any)?.status === 404) {
      return []
    }
    throw new Error('Failed to fetch user sessions')
  }
}

export async function getSessionById(sessionId: string): Promise<CoffeeChatSession | null> {
  try {
    const response = await cosmicWrite.objects.findOne({
      type: 'coffee-chat-sessions',
      id: sessionId
    }).depth(1)

    return response.object as CoffeeChatSession
  } catch (error) {
    console.error('Error fetching session:', error)
    if ((error as any)?.status === 404) {
      return null
    }
    throw new Error('Failed to fetch session')
  }
}

export async function createSession(sessionData: SessionData): Promise<CoffeeChatSession> {
  try {
    // Generate a title for the session
    const title = `Coffee Chat Session - ${new Date(sessionData.scheduled_datetime).toLocaleDateString()}`
    
    const response = await cosmicWrite.objects.insertOne({
      title,
      type: 'coffee-chat-sessions',
      status: 'published',
      metadata: {
        user_1: sessionData.user_1,
        user_2: sessionData.user_2,
        scheduled_datetime: sessionData.scheduled_datetime,
        status: {
          key: sessionData.status,
          value: getStatusLabel(sessionData.status)
        },
        meeting_link: sessionData.meeting_link || '',
        icebreaker_question: sessionData.icebreaker_question || '',
        internal_notes: sessionData.internal_notes || ''
      }
    })

    return response.object as CoffeeChatSession
  } catch (error) {
    console.error('Error creating session:', error)
    throw new Error('Failed to create session')
  }
}

export async function updateSession(sessionId: string, updates: Partial<SessionData>): Promise<CoffeeChatSession> {
  try {
    const existingSession = await getSessionById(sessionId)
    
    if (!existingSession) {
      throw new Error('Session not found')
    }

    const updatedMetadata = {
      ...existingSession.metadata,
      ...updates
    }

    // Update status format if status is being changed
    if (updates.status) {
      updatedMetadata.status = {
        key: updates.status,
        value: getStatusLabel(updates.status)
      }
    }

    const response = await cosmicWrite.objects.updateOne(sessionId, {
      metadata: updatedMetadata
    })

    return response.object as CoffeeChatSession
  } catch (error) {
    console.error('Error updating session:', error)
    throw new Error('Failed to update session')
  }
}

export async function deleteSession(sessionId: string): Promise<void> {
  try {
    await cosmicWrite.objects.deleteOne(sessionId)
  } catch (error) {
    console.error('Error deleting session:', error)
    throw new Error('Failed to delete session')
  }
}

export async function getUpcomingSessions(userId: string): Promise<CoffeeChatSession[]> {
  try {
    const allSessions = await getUserSessions(userId)
    const now = new Date()
    
    return allSessions.filter((session: CoffeeChatSession) => {
      const sessionDatetime = session.metadata?.scheduled_datetime
      if (!sessionDatetime) return false
      
      const sessionDate = new Date(sessionDatetime)
      return sessionDate > now && session.metadata?.status?.key === 'SCHEDULED'
    }).sort((a, b) => {
      const dateA = new Date(a.metadata?.scheduled_datetime || '')
      const dateB = new Date(b.metadata?.scheduled_datetime || '')
      return dateA.getTime() - dateB.getTime()
    })
  } catch (error) {
    console.error('Error fetching upcoming sessions:', error)
    return []
  }
}

export async function getPastSessions(userId: string): Promise<CoffeeChatSession[]> {
  try {
    const allSessions = await getUserSessions(userId)
    const now = new Date()
    
    return allSessions.filter((session: CoffeeChatSession) => {
      const sessionDatetime = session.metadata?.scheduled_datetime
      if (!sessionDatetime) return false
      
      const sessionDate = new Date(sessionDatetime)
      return sessionDate <= now || session.metadata?.status?.key === 'COMPLETED'
    }).sort((a, b) => {
      const dateA = new Date(a.metadata?.scheduled_datetime || '')
      const dateB = new Date(b.metadata?.scheduled_datetime || '')
      return dateB.getTime() - dateA.getTime()
    })
  } catch (error) {
    console.error('Error fetching past sessions:', error)
    return []
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'SCHEDULED':
      return 'Scheduled'
    case 'COMPLETED':
      return 'Completed'
    case 'NEEDS_RESCHEDULE':
      return 'Needs Reschedule'
    case 'CANCELLED':
      return 'Cancelled'
    default:
      return 'Unknown'
  }
}

// Helper function to generate icebreaker questions
export function generateIcebreakerQuestion(): string {
  const questions = [
    "What's the most interesting industry you've sold into?",
    "What's your favorite sales tool and why?",
    "What's the best piece of sales advice you've ever received?",
    "What's your biggest sales win this year?",
    "What sales skill are you working on improving right now?",
    "What's your go-to approach for handling objections?",
    "What motivates you most in your sales role?",
    "What's the most challenging part of your sales process?",
    "What's your favorite way to research prospects?",
    "What's one sales trend you're excited about?"
  ]
  
  const randomIndex = Math.floor(Math.random() * questions.length)
  // Ensure we always return a string by providing a guaranteed fallback
  return questions[randomIndex] ?? "What's the most interesting industry you've sold into?"
}