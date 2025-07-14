import { cosmicWrite } from '@/lib/cosmic'
import type { UserProfile } from '@/types'

export interface ProfileData {
  full_name: string
  email_address?: string
  current_role: string
  company: string
  linkedin_url?: string
  bio?: string
  fun_fact?: string
  profile_picture?: any
  timezone?: {
    key: string
    value: string
  }
  seniority_level?: {
    key: string
    value: string
  }
  sales_focus?: {
    key: string
    value: string
  }
  industry_vertical?: {
    key: string
    value: string
  }
  preferred_chat_times?: string[]
  topics_to_discuss?: string[]
  async_communication?: boolean
  profile_complete?: boolean
  account_status?: {
    key: string
    value: string
  }
}

export async function getUserProfileById(userId: string): Promise<UserProfile | null> {
  try {
    const response = await cosmicWrite.objects.find({
      type: 'user-profiles'
    }).props(['id', 'title', 'slug', 'metadata']).depth(1)

    if (!response.objects || response.objects.length === 0) {
      return null
    }

    // Find profile by matching the user ID or email
    const profile = response.objects.find((obj: any) => 
      obj.id === userId || 
      obj.metadata?.email_address === userId ||
      obj.slug === userId
    )

    return profile || null
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}

export async function updateUserProfile(userId: string, profileData: ProfileData): Promise<UserProfile> {
  try {
    // First find the existing profile
    const existingProfile = await getUserProfileById(userId)
    
    if (!existingProfile) {
      throw new Error('Profile not found')
    }

    // Update the profile
    const response = await cosmicWrite.objects.updateOne(existingProfile.id, {
      metadata: {
        ...existingProfile.metadata,
        ...profileData
      }
    })

    return response.object
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
}

export async function createUserProfile(profileData: ProfileData & { 
  title: string
  slug: string 
}): Promise<UserProfile> {
  try {
    const response = await cosmicWrite.objects.insertOne({
      title: profileData.title,
      type: 'user-profiles',
      status: 'published',
      slug: profileData.slug,
      metadata: profileData
    })

    return response.object
  } catch (error) {
    console.error('Error creating user profile:', error)
    throw error
  }
}