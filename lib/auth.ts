import { cosmic } from '@/lib/cosmic'
import type { UserProfile } from '@/types'

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
    // Check if user already exists
    const existingUsers = await cosmic.objects.find({
      type: 'user-profiles',
      'metadata.email': userData.email
    }).props(['id', 'metadata']);

    if (existingUsers.objects.length > 0) {
      throw new Error('An account with this email already exists')
    }

    // Hash password
    const hashedPassword = hashPassword(userData.password)

    // Create user profile in Cosmic
    const userProfile = await cosmic.objects.insertOne({
      title: userData.fullName,
      slug: generateSlug(userData.fullName),
      type: 'user-profiles',
      metadata: {
        full_name: userData.fullName,
        email: userData.email,
        password_hash: hashedPassword,
        current_role: userData.currentRole,
        company: userData.company,
        seniority_level: {
          key: userData.seniorityLevel,
          value: getSeniorityLevelValue(userData.seniorityLevel)
        },
        industry_vertical: {
          key: userData.industryVertical,
          value: getIndustryVerticalValue(userData.industryVertical)
        },
        bio: userData.bio,
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
    })

    // Set current session
    currentSession = {
      user: userProfile.object as UserProfile,
      isAuthenticated: true
    }

    return userProfile.object as UserProfile
  } catch (error) {
    console.error('Sign up error:', error)
    throw error
  }
}

// Sign in existing user
export async function signIn(email: string, password: string): Promise<UserProfile> {
  try {
    // Find user by email
    const response = await cosmic.objects.find({
      type: 'user-profiles',
      'metadata.email': email
    }).props(['id', 'title', 'slug', 'metadata']).depth(1)

    if (response.objects.length === 0) {
      throw new Error('Invalid email or password')
    }

    const user = response.objects[0] as UserProfile

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
  } catch (error) {
    console.error('Sign in error:', error)
    throw error
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