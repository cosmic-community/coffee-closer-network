import Link from 'next/link'
import type { CoffeeChatSession } from '@/types'

interface UpcomingChatsProps {
  sessions: CoffeeChatSession[]
  currentUserId: string
}

export default function UpcomingChats({ sessions, currentUserId }: UpcomingChatsProps) {
  const upcomingChats = sessions
    .filter(session => session.metadata?.status?.key === 'SCHEDULED')
    .sort((a, b) => {
      const dateA = new Date(a.metadata?.scheduled_datetime || '')
      const dateB = new Date(b.metadata?.scheduled_datetime || '')
      return dateA.getTime() - dateB.getTime()
    })

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Upcoming Coffee Chats</h2>
        <Link href="/matches" className="text-coffee-600 hover:text-coffee-700 font-medium">
          View All →
        </Link>
      </div>

      {upcomingChats.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-neutral-400 text-4xl mb-4">☕</div>
          <p className="text-neutral-600 mb-4">No upcoming chats scheduled</p>
          <a href="/directory" className="btn btn-primary">
            Find Someone to Chat With
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {upcomingChats.slice(0, 3).map((session) => {
            const otherUser = session.metadata?.user_1?.id === currentUserId 
              ? session.metadata?.user_2 
              : session.metadata?.user_1

            if (!otherUser) return null

            return (
              <div key={session.id} className="border border-neutral-200 rounded-lg p-4 hover:border-coffee-300 transition-colors">
                <div className="flex items-start gap-4">
                  {otherUser.metadata?.profile_picture && (
                    <img
                      src={`${otherUser.metadata.profile_picture.imgix_url}?w=120&h=120&fit=crop&auto=format,compress`}
                      alt={otherUser.metadata?.full_name || otherUser.title}
                      width="48"
                      height="48"
                      className="rounded-full"
                    />
                  )}
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-neutral-900">
                        {otherUser.metadata?.full_name || otherUser.title}
                      </h3>
                      <span className="text-sm text-neutral-600">
                        {session.metadata?.scheduled_datetime && (
                          new Date(session.metadata.scheduled_datetime).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })
                        )}
                      </span>
                    </div>
                    
                    <p className="text-sm text-neutral-600 mb-2">
                      {otherUser.metadata?.current_role}
                      {otherUser.metadata?.company && (
                        <span> at {otherUser.metadata.company}</span>
                      )}
                    </p>
                    
                    {session.metadata?.icebreaker_question && (
                      <p className="text-sm text-coffee-700 italic mb-3">
                        "Ask about: {session.metadata.icebreaker_question}"
                      </p>
                    )}
                    
                    <div className="flex gap-2">
                      <Link
                        href={`/matches/${session.slug}`}
                        className="btn btn-primary text-sm px-4 py-2"
                      >
                        View Details
                      </Link>
                      {session.metadata?.meeting_link && (
                        <a
                          href={session.metadata.meeting_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary text-sm px-4 py-2"
                        >
                          Join Call
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}