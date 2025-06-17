import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/session'
import { getUserProfileById } from '@/lib/cosmic-profile'
import ProtectedRoute from '@/components/ProtectedRoute'
import Card from '@/components/Card'
import Button from '@/components/Button'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const user = await getSession()
  
  if (!user) {
    redirect('/login')
  }

  const userProfile = await getUserProfileById(user.id)

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-neutral-50">
        <div className="container-custom py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
              {userProfile?.metadata?.profile_picture && (
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
                  Welcome back, {userProfile?.metadata?.full_name?.split(' ')[0] || user.fullName.split(' ')[0]}!
                </h1>
                <p className="text-lg text-neutral-600">
                  {userProfile?.metadata?.current_role}
                  {userProfile?.metadata?.company && (
                    <span> at {userProfile.metadata.company}</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Profile Status */}
              <Card>
                <h2 className="text-xl font-semibold mb-4">Profile Status</h2>
                {userProfile ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 font-medium">✓ Profile Complete</p>
                      <p className="text-sm text-neutral-600">You're all set to start networking!</p>
                    </div>
                    <Link href="/profile">
                      <Button variant="outline" size="small">
                        Edit Profile
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-600 font-medium">⚠ Incomplete Profile</p>
                      <p className="text-sm text-neutral-600">Complete your profile to start networking</p>
                    </div>
                    <Link href="/profile/setup">
                      <Button variant="primary" size="small">
                        Complete Profile
                      </Button>
                    </Link>
                  </div>
                )}
              </Card>

              {/* Getting Started */}
              <Card>
                <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-green-500 text-xl">✓</span>
                    <div>
                      <h3 className="font-medium">Account Created</h3>
                      <p className="text-sm text-neutral-600">You've successfully joined Coffee Closer Network</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className={`text-xl ${userProfile ? 'text-green-500' : 'text-neutral-400'}`}>
                      {userProfile ? '✓' : '○'}
                    </span>
                    <div>
                      <h3 className="font-medium">Complete Your Profile</h3>
                      <p className="text-sm text-neutral-600">
                        Tell us about yourself to get better matches
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-neutral-400 text-xl">○</span>
                    <div>
                      <h3 className="font-medium">Get Your First Match</h3>
                      <p className="text-sm text-neutral-600">
                        We'll find you a great conversation partner
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <Card>
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link href="/profile" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      Edit Profile
                    </Button>
                  </Link>
                  <Button variant="secondary" className="w-full justify-start" disabled>
                    Find Matches (Coming Soon)
                  </Button>
                  <Button variant="secondary" className="w-full justify-start" disabled>
                    Schedule Chat (Coming Soon)
                  </Button>
                </div>
              </Card>

              {/* Profile Summary */}
              {userProfile && (
                <Card>
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
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}