import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getUserProfileById } from '@/lib/cosmic'
import ProtectedRoute from '@/components/ProtectedRoute'

export default async function DashboardPage() {
  const user = await getSession()
  
  if (!user) {
    redirect('/login')
  }

  // Get user profile data
  let userProfile = null
  if (user.id !== 'admin') {
    userProfile = await getUserProfileById(user.id)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-neutral-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                  Welcome, {user.fullName}!
                </h1>
                <p className="text-neutral-600">
                  {user.isAdmin ? 'Admin Dashboard' : 'Your Coffee Closer Network Dashboard'}
                </p>
              </div>

              {user.isAdmin ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-coffee-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-coffee-800 mb-2">Admin Panel</h3>
                    <p className="text-coffee-600">Manage users, sessions, and content</p>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Analytics</h3>
                    <p className="text-blue-600">View platform usage and metrics</p>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Settings</h3>
                    <p className="text-green-600">Configure platform settings</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {userProfile && (
                    <div className="bg-coffee-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-coffee-800 mb-2">Your Profile</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-coffee-600 font-medium">Role:</span> {userProfile.metadata?.current_role || 'Not specified'}
                        </div>
                        <div>
                          <span className="text-coffee-600 font-medium">Company:</span> {userProfile.metadata?.company || 'Not specified'}
                        </div>
                        <div>
                          <span className="text-coffee-600 font-medium">Seniority:</span> {userProfile.metadata?.seniority_level?.value || 'Not specified'}
                        </div>
                        <div>
                          <span className="text-coffee-600 font-medium">Industry:</span> {userProfile.metadata?.industry_vertical?.value || 'Not specified'}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-800 mb-2">Coffee Chats</h3>
                      <p className="text-blue-600 mb-4">Connect with other sales professionals</p>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                        Find Matches
                      </button>
                    </div>
                    
                    <div className="bg-green-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-green-800 mb-2">My Network</h3>
                      <p className="text-green-600 mb-4">View your connections</p>
                      <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                        View Network
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}