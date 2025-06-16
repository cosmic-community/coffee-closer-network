'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, signOut } from '@/lib/auth'
import type { UserProfile } from '@/types'

export default function DashboardAuthPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push('/login')
          return
        }
        setUser(currentUser)
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-16">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
              {user.metadata.profile_picture ? (
                <img 
                  src={`${user.metadata.profile_picture.imgix_url}?w=160&h=160&fit=crop&auto=format,compress`}
                  alt={user.metadata.full_name || 'Profile'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-coffee-600 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {user.metadata.full_name?.charAt(0) || '?'}
                  </span>
                </div>
              )}
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">
              Welcome, {user.metadata.full_name}!
            </h1>
            <p className="text-neutral-600">
              {user.metadata.current_role} at {user.metadata.company}
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-neutral-50 p-6 rounded-lg">
                <h3 className="font-semibold text-neutral-900 mb-2">Profile Information</h3>
                <div className="space-y-2 text-sm text-neutral-600">
                  <p><strong>Role:</strong> {user.metadata.current_role}</p>
                  <p><strong>Company:</strong> {user.metadata.company}</p>
                  <p><strong>Industry:</strong> {user.metadata.industry_vertical?.value}</p>
                  <p><strong>Seniority:</strong> {user.metadata.seniority_level?.value}</p>
                </div>
              </div>

              <div className="bg-neutral-50 p-6 rounded-lg">
                <h3 className="font-semibold text-neutral-900 mb-2">Account Settings</h3>
                <div className="space-y-2">
                  <button className="text-sm text-coffee-600 hover:text-coffee-700 block">
                    Edit Profile
                  </button>
                  <button className="text-sm text-coffee-600 hover:text-coffee-700 block">
                    Update Preferences
                  </button>
                  <button className="text-sm text-coffee-600 hover:text-coffee-700 block">
                    Change Password
                  </button>
                </div>
              </div>
            </div>

            {user.metadata.bio && (
              <div className="bg-neutral-50 p-6 rounded-lg">
                <h3 className="font-semibold text-neutral-900 mb-2">Bio</h3>
                <p className="text-neutral-600">{user.metadata.bio}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <button
                onClick={() => router.push('/dashboard')}
                className="btn btn-primary"
              >
                Go to Dashboard
              </button>
              <button
                onClick={handleSignOut}
                className="btn btn-secondary"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}