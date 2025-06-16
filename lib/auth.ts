import { cosmic } from '@/lib/cosmic'
import type { UserProfile } from '@/types'

// Create write client with proper error handling
function createWriteClient() {
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG
  const readKey = process.env.COSMIC_READ_KEY
  const writeKey = process.env.COSMIC_WRITE_KEY

  console.log('Environment check:', {
    hasBucketSlug: !!bucketSlug,
    hasReadKey: !!readKey,
    hasWriteKey: !!writeKey,
    bucketSlug: bucketSlug?.substring(0, 5) + '...' // Log first 5 chars for debugging
  })

  if (!bucketSlug) {
    console.error('Missing COSMIC_BUCKET_SLUG environment variable')
    throw new Error('Server configuration error: Missing bucket slug')
  }
  
  if (!readKey) {
    console.error('Missing COSMIC_READ_KEY environment variable')
    throw new Error('Server configuration error: Missing read key')
  }
  
  if (!writeKey) {
    console.error('Missing COSMIC_WRITE_KEY environment variable')
    throw new Error('Server configuration error: Missing write key')
  }

  try {
    // Dynamically import and create client only when needed
    const { createBucketClient } = require('@cosmicjs/sdk')
    
    return createBucketClient({
      bucketSlug,
      readKey,
      writeKey,
    })
  } catch (importError: any) {
    console.error('Failed to create Cosmic client:', importError)
    throw new Error('Server configuration error: Unable to initialize database connection')
  }
}

// Simple in-memory session storage (in production, use proper session management)
let currentSession: {
  user: UserProfile | null
  isAuthenticated: boolean
} = {
  user: null,
  isAuthenticated: false
}

// Hash password (in production, use bcrypt or similar)
function hashPassword(password: string): string {
  // This is a simple hash for demo purposes - use proper hashing in production
  return btoa(password + 'coffee-closer-salt')
}

// Verify password
function verifyPassword(password: string, hashedPassword: string): boolean {
  return hashPassword(password) === hashedPassword
}

// Generate slug from name
function generateSlug(fullName: string): string {
  return fullName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    + '-' + Math.random().toString(36).substr(2, 9) // Add random suffix to ensure uniqueness
}

// Sign up new user
export async function signUp(userData: {
  fullName: string
  email: string
  password: string
  currentRole: string
  company: string
  seniorityLevel: string
  industryVertical: string
  bio: string
}): Promise<UserProfile> {
  try {
    console.log('Starting signup process for:', userData.email)

    // Validate input data
    if (!userData.fullName?.trim()) {
      throw new Error('Full name is required')
    }
    if (!userData.email?.trim()) {
      throw new Error('Email is required')
    }
    if (!userData.password?.trim()) {
      throw new Error('Password is required')
    }
    if (!userData.currentRole?.trim()) {
      throw new Error('Current role is required')
    }
    if (!userData.seniorityLevel?.trim()) {
      throw new Error('Seniority level is required')
    }
    if (!userData.industryVertical?.trim()) {
      throw new Error('Industry vertical is required')
    }

    // Check if user already exists (use read-only client)
    try {
      console.log('Checking if user exists with email:', userData.email)
      const existingUsers = await cosmic.objects.find({
        type: 'user-profiles',
        'metadata.email': userData.email.trim().toLowerCase()
      }).props(['id', 'metadata.email'])

      if (existingUsers.objects && existingUsers.objects.length > 0) {
        console.log('User already exists')
        throw new Error('An account with this email already exists')
      }
    } catch (error: any) {
      // If error is 404, no users exist with this email, which is what we want
      if (error.status !== 404) {
        console.error('Error checking existing user:', error)
        if (error.message === 'An account with this email already exists') {
          throw error // Re-throw the user exists error
        }
        // Continue with signup if it's just a query error
      }
    }

    console.log('User does not exist, proceeding with creation')

    // Hash password
    const hashedPassword = hashPassword(userData.password)

    // Prepare metadata object matching the Cosmic schema
    const metadata = {
      full_name: userData.fullName.trim(),
      email: userData.email.trim().toLowerCase(),
      password_hash: hashedPassword,
      current_role: userData.currentRole.trim(),
      company: userData.company?.trim() || '',
      seniority_level: {
        key: userData.seniorityLevel,
        value: getSeniorityLevelValue(userData.seniorityLevel)
      },
      industry_vertical: {
        key: userData.industryVertical,
        value: getIndustryVerticalValue(userData.industryVertical)
      },
      bio: userData.bio?.trim() || '',
      timezone: {
        key: 'EST',
        value: 'Eastern Time (EST/EDT)'
      },
      sales_focus: {
        key: 'MID_MARKET',
        value: 'Mid-Market'
      },
      preferred_chat_times: [],
      topics_to_discuss: [],
      async_communication: false
    }

    console.log('Creating user with metadata:', {
      full_name: metadata.full_name,
      email: metadata.email,
      current_role: metadata.current_role,
      seniority_level: metadata.seniority_level,
      industry_vertical: metadata.industry_vertical
    })

    // Create write client
    const writeClient = createWriteClient()

    // Create user profile in Cosmic using write client
    const userProfile = await writeClient.objects.insertOne({
      title: userData.fullName.trim(),
      slug: generateSlug(userData.fullName.trim()),
      type: 'user-profiles',
      metadata: metadata
    })

    console.log('User created successfully:', userProfile.object.id)

    // Transform the response to match our UserProfile type with all required fields
    const createdUser: UserProfile = {
      id: userProfile.object.id,
      title: userProfile.object.title,
      slug: userProfile.object.slug,
      content: userProfile.object.content || '',
      metadata: userProfile.object.metadata as UserProfile['metadata'],
      type_slug: 'user-profiles' as const,
      created_at: userProfile.object.created_at || new Date().toISOString(),
      modified_at: userProfile.object.modified_at || new Date().toISOString()
    }

    // Set current session
    currentSession = {
      user: createdUser,
      isAuthenticated: true
    }

    console.log('Signup completed successfully')
    return createdUser
  } catch (error: any) {
    console.error('Sign up error:', {
      message: error.message,
      status: error.status,
      stack: error.stack
    })
    
    // Provide more specific error messages
    if (error.message && error.message.includes('Server configuration error')) {
      throw error // Re-throw server config errors as-is
    } else if (error.message && error.message.includes('already exists')) {
      throw new Error('An account with this email already exists')
    } else if (error.message && (
      error.message.includes('required') || 
      error.message.includes('Full name') ||
      error.message.includes('Email') ||
      error.message.includes('Password') ||
      error.message.includes('Current role') ||
      error.message.includes('Seniority level') ||
      error.message.includes('Industry vertical')
    )) {
      throw new Error(error.message)
    } else if (error.status === 400) {
      throw new Error('Invalid data provided. Please check your information and try again.')
    } else if (error.status === 403) {
      throw new Error('Permission denied. Please contact support.')
    } else if (error.status === 401) {
      throw new Error('Authentication failed. Please try again.')
    } else if (error.message && error.message.includes('writeKey')) {
      throw new Error('Server configuration error. Please contact support.')
    } else {
      throw new Error('An error occurred during signup. Please try again.')
    }
  }
}

// Sign in existing user
export async function signIn(email: string, password: string): Promise<UserProfile> {
  try {
    if (!email?.trim()) {
      throw new Error('Email is required')
    }
    if (!password?.trim()) {
      throw new Error('Password is required')
    }

    // Find user by email (use read-only client)
    const response = await cosmic.objects.find({
      type: 'user-profiles',
      'metadata.email': email.trim().toLowerCase()
    }).props(['id', 'title', 'slug', 'content', 'metadata', 'created_at', 'modified_at']).depth(1)

    if (!response.objects || response.objects.length === 0) {
      throw new Error('Invalid email or password')
    }

    const userObject = response.objects[0]

    // Properly type the user object with all required fields
    const user: UserProfile = {
      id: userObject.id,
      title: userObject.title,
      slug: userObject.slug,
      content: userObject.content || '',
      metadata: userObject.metadata as UserProfile['metadata'],
      type_slug: 'user-profiles' as const,
      created_at: userObject.created_at || new Date().toISOString(),
      modified_at: userObject.modified_at || new Date().toISOString()
    }

    // Verify password
    const hashedPassword = user.metadata.password_hash
    if (!hashedPassword || !verifyPassword(password, hashedPassword)) {
      throw new Error('Invalid email or password')
    }

    // Set current session
    currentSession = {
      user: user,
      isAuthenticated: true
    }

    return user
  } catch (error: any) {
    console.error('Sign in error:', error)
    
    if (error.status === 404 || error.message === 'Invalid email or password') {
      throw new Error('Invalid email or password')
    } else if (error.message && (
      error.message.includes('Email is required') ||
      error.message.includes('Password is required')
    )) {
      throw new Error(error.message)
    } else {
      throw new Error('An error occurred during sign in. Please try again.')
    }
  }
}

// Get current user
export async function getCurrentUser(): Promise<UserProfile | null> {
  return currentSession.user
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return currentSession.isAuthenticated
}

// Sign out
export async function signOut(): Promise<void> {
  currentSession = {
    user: null,
    isAuthenticated: false
  }
}

// Helper functions for dropdown values
function getSeniorityLevelValue(key: string): string {
  const levels: Record<string, string> = {
    'SDR': 'SDR (Sales Development Rep)',
    'BDR': 'BDR (Business Development Rep)',
    'AE': 'AE (Account Executive)',
    'SR_AE': 'Senior Account Executive',
    'AM': 'Account Manager',
    'CSM': 'Customer Success Manager',
    'MANAGER': 'Sales Manager',
    'DIRECTOR': 'Sales Director',
    'VP': 'VP of Sales'
  }
  return levels[key] || key
}

function getIndustryVerticalValue(key: string): string {
  const industries: Record<string, string> = {
    'SAAS': 'SaaS',
    'FINTECH': 'Fintech',
    'HEALTHCARE': 'Healthcare',
    'EDTECH': 'EdTech',
    'ECOMMERCE': 'E-commerce',
    'MARTECH': 'MarTech',
    'CYBERSECURITY': 'Cybersecurity',
    'OTHER': 'Other'
  }
  return industries[key] || key
}