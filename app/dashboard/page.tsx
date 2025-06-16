import { getCoffeeChatSessions, getUserProfile } from '@/lib/cosmic'
import DashboardStats from '@/components/DashboardStats'
import UpcomingChats from '@/components/UpcomingChats'
import QuickActions from '@/components/QuickActions'

// Mock current user - in a real app, this would come from authentication
const CURRENT_USER_SLUG = 'sarah-johnson'

export default async function DashboardPage() {
  const [userProfile, coffeeChatSessions] = await Promise.all([
    getUserProfile(CURRENT_USER_SLUG),
    getCoffeeChatSessions()
  ])

  if (!userProfile) {
    return (
      <div className="container-custom py-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">
            Welcome to Coffee Closer Network
          </h1>
          <p className="text-neutral-600 mb-8">
            Please complete your profile to get started with coffee chats.
          </p>
          <a href="/profile/setup" className="btn btn-primary">
            Complete Profile
          </a>
        </div>
      </div>
    )
  }

  // Filter sessions for current user
  const userSessions = coffeeChatSessions.filter(session => 
    session.metadata?.user_1?.id === userProfile.id || 
    session.metadata?.user_2?.id === userProfile.id
  )

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            {userProfile.metadata?.profile_picture && (
              <img
                src={`${userProfile.metadata.profile_picture.imgix_url}?w=200&h=200&fit=crop&auto=format,compress`}
                alt={userProfile.metadata?.full_name || userProfile.title}
                width="80"
                height="80"
                className="rounded-full"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">
                Welcome back, {userProfile.metadata?.full_name?.split(' ')[0] || userProfile.title}!
              </h1>
              <p className="text-lg text-neutral-600">
                {userProfile.metadata?.current_role}
                {userProfile.metadata?.company && (
                  <span> at {userProfile.metadata.company}</span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <DashboardStats sessions={userSessions} />
            <UpcomingChats sessions={userSessions} currentUserId={userProfile.id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <QuickActions userProfile={userProfile} />
            
            {/* Profile Summary */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Your Profile</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-neutral-600">Industry:</span>
                  <div className="font-medium">
                    {userProfile.metadata?.industry_vertical?.value || 'Not specified'}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-neutral-600">Timezone:</span>
                  <div className="font-medium">
                    {userProfile.metadata?.timezone?.value || 'Not specified'}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-neutral-600">Topics:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {userProfile.metadata?.topics_to_discuss?.slice(0, 3).map((topic, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-coffee-100 text-coffee-700 text-xs rounded"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <a href="/profile/edit" className="btn btn-secondary w-full mt-4">
                Edit Profile
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}