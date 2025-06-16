import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { createBucketClient } from '@cosmicjs/sdk'
import ProfileForm from '@/components/ProfileForm'
import ProtectedRoute from '@/components/ProtectedRoute'
import { UserProfile } from '@/types'

const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG || '',
  readKey: process.env.COSMIC_READ_KEY || '',
})

async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'user-profiles',
      id: userId
    }).props(['id', 'title', 'slug', 'content', 'metadata', 'created_at', 'modified_at']).depth(1)

    return response.object as UserProfile
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}

export default async function ProfilePage() {
  const user = await getSession()
  
  if (!user) {
    redirect('/login')
  }

  const userProfile = await getUserProfile(user.id)

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                Edit Your Profile
              </h1>
              <p className="text-neutral-600">
                Update your information to help others connect with you.
              </p>
            </div>

            <ProfileForm 
              initialData={userProfile?.metadata}
              onSuccess={() => {
                // Handle success - could redirect or show toast
              }}
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}