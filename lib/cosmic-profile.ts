import { cosmic } from '@/lib/cosmic'
import type { UserProfile } from '@/types'

export async function getUserProfileById(userId: string): Promise<UserProfile | null> {
  try {
    if (userId === 'admin') {
      // Return mock admin profile
      return {
        id: 'admin',
        title: 'Administrator',
        slug: 'admin',
        content: '',
        type_slug: 'user-profiles',
        created_at: new Date().toISOString(),
        modified_at: new Date().toISOString(),
        metadata: {
          full_name: 'Administrator',
          email: 'admin@coffeecloser.network',
          current_role: 'System Administrator',
          company: 'Coffee Closer Network',
        }
      }
    }

    const response = await cosmic.objects.findOne({
      type: 'user-profiles',
      id: userId
    }).props(['id', 'title', 'slug', 'content', 'metadata', 'created_at', 'modified_at']).depth(1)

    return response.object as UserProfile
  } catch (error) {
    console.error('Error fetching user profile by ID:', error)
    if ((error as any)?.status === 404) {
      return null
    }
    throw new Error('Failed to fetch user profile')
  }
}

export async function getUserProfileByEmail(email: string): Promise<UserProfile | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'user-profiles',
      'metadata.email_address': email.toLowerCase()
    }).props(['id', 'title', 'slug', 'content', 'metadata', 'created_at', 'modified_at']).depth(1)

    return response.object as UserProfile
  } catch (error) {
    console.error('Error fetching user profile by email:', error)
    if ((error as any)?.status === 404) {
      return null
    }
    throw new Error('Failed to fetch user profile by email')
  }
}

export async function createUserProfile(profileData: {
  title: string
  slug: string
  metadata: UserProfile['metadata']
}): Promise<UserProfile> {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'user-profiles',
      title: profileData.title,
      slug: profileData.slug,
      metadata: profileData.metadata
    })

    return response.object as UserProfile
  } catch (error) {
    console.error('Error creating user profile:', error)
    throw new Error('Failed to create user profile')
  }
}

export async function updateUserProfile(userId: string, metadata: Partial<UserProfile['metadata']>): Promise<UserProfile> {
  try {
    const response = await cosmic.objects.updateOne(userId, {
      metadata
    })

    return response.object as UserProfile
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw new Error('Failed to update user profile')
  }
}

export async function checkUserExists(email: string): Promise<boolean> {
  try {
    await cosmic.objects.findOne({
      type: 'user-profiles',
      'metadata.email_address': email.toLowerCase()
    })
    return true
  } catch (error) {
    if ((error as any)?.status === 404) {
      return false
    }
    throw error
  }
}