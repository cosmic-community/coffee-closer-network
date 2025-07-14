import { createBucketClient } from '@cosmicjs/sdk'

// Validate required environment variables
const bucketSlug = process.env.COSMIC_BUCKET_SLUG
const readKey = process.env.COSMIC_READ_KEY
const writeKey = process.env.COSMIC_WRITE_KEY

if (!bucketSlug) {
  throw new Error('COSMIC_BUCKET_SLUG environment variable is required')
}

if (!readKey) {
  throw new Error('COSMIC_READ_KEY environment variable is required')
}

// Read-only client for public queries
export const cosmic = createBucketClient({
  bucketSlug,
  readKey,
})

// Write client for authenticated operations (server-side only)
export const cosmicWrite = createBucketClient({
  bucketSlug,
  readKey,
  writeKey: writeKey || '',
})

// Helper function to get all user profiles
export async function getUserProfiles() {
  try {
    const response = await cosmic.objects.find({
      type: 'user-profiles'
    }).props(['id', 'title', 'slug', 'metadata', 'created_at', 'modified_at']).depth(1)
    
    return response.objects || []
  } catch (error: any) {
    if (error.status === 404) {
      return []
    }
    throw error
  }
}

// Helper function to get user profile by email
export async function getUserProfileByEmail(email: string) {
  try {
    const response = await cosmic.objects.find({
      type: 'user-profiles',
      'metadata.email_address': email.toLowerCase()
    }).props(['id', 'title', 'slug', 'metadata', 'created_at', 'modified_at']).depth(1)
    
    return response.objects?.[0] || null
  } catch (error: any) {
    if (error.status === 404) {
      return null
    }
    throw error
  }
}

// Helper function to get user profile by ID
export async function getUserProfileById(id: string) {
  try {
    const response = await cosmic.objects.findOne({
      type: 'user-profiles',
      id
    }).props(['id', 'title', 'slug', 'metadata', 'created_at', 'modified_at']).depth(1)
    
    return response.object || null
  } catch (error: any) {
    if (error.status === 404) {
      return null
    }
    throw error
  }
}

// Helper function to get all coffee chat sessions
export async function getCoffeeChatSessions() {
  try {
    const response = await cosmic.objects.find({
      type: 'coffee-chat-sessions'
    }).props(['id', 'title', 'slug', 'metadata', 'created_at', 'modified_at']).depth(1)
    
    return response.objects || []
  } catch (error: any) {
    if (error.status === 404) {
      return []
    }
    throw error
  }
}

// Helper function to create user profile
export async function createUserProfile(data: {
  title: string
  slug: string
  metadata: Record<string, any>
}) {
  if (!writeKey) {
    throw new Error('COSMIC_WRITE_KEY is required for write operations')
  }
  
  return await cosmicWrite.objects.insertOne({
    type: 'user-profiles',
    status: 'published',
    ...data
  })
}

// Helper function to update user profile
export async function updateUserProfile(id: string, data: {
  title?: string
  metadata?: Record<string, any>
}) {
  if (!writeKey) {
    throw new Error('COSMIC_WRITE_KEY is required for write operations')
  }
  
  return await cosmicWrite.objects.updateOne(id, data)
}

// Helper function to check if user exists by email
export async function checkUserExists(email: string): Promise<boolean> {
  try {
    const profile = await getUserProfileByEmail(email)
    return profile !== null
  } catch (error) {
    return false
  }
}

// Helper function to validate bucket connection
export async function validateBucketConnection(): Promise<boolean> {
  try {
    await cosmic.objects.find({ type: 'user-profiles' }).limit(1)
    return true
  } catch (error) {
    console.error('Bucket connection validation failed:', error)
    return false
  }
}

// Export bucket info for debugging
export const bucketInfo = {
  slug: bucketSlug,
  hasReadKey: !!readKey,
  hasWriteKey: !!writeKey
}