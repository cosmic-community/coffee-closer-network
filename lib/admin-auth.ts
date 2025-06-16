// Admin authentication system for Coffee Closer Network
import { UserProfile } from '@/types'

// Admin credentials - in production, these should be stored securely
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin',
  profile: {
    id: 'admin-001',
    title: 'Administrator',
    slug: 'admin',
    content: 'System Administrator',
    type_slug: 'user-profiles' as const,
    created_at: new Date().toISOString(),
    modified_at: new Date().toISOString(),
    metadata: {
      full_name: 'Administrator',
      email: 'admin@coffeecloser.network',
      password_hash: 'admin-hash',
      current_role: 'Administrator',
      company: 'Coffee Closer Network',
      seniority_level: {
        key: 'ADMIN',
        value: 'Administrator'
      },
      industry_vertical: {
        key: 'PLATFORM',
        value: 'Platform Management'
      },
      bio: 'System administrator for the Coffee Closer Network platform.',
      timezone: {
        key: 'EST',
        value: 'Eastern Time (EST/EDT)'
      },
      sales_focus: {
        key: 'PLATFORM',
        value: 'Platform Management'
      },
      preferred_chat_times: [],
      topics_to_discuss: [],
      async_communication: true
    }
  } as UserProfile
}

// Simple session storage
let adminSession: {
  user: UserProfile | null
  isAuthenticated: boolean
} = {
  user: null,
  isAuthenticated: false
}

// Admin login function
export async function adminLogin(username: string, password: string): Promise<UserProfile> {
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    adminSession = {
      user: ADMIN_CREDENTIALS.profile,
      isAuthenticated: true
    }
    return ADMIN_CREDENTIALS.profile
  }
  throw new Error('Invalid admin credentials')
}

// Get current admin user
export function getCurrentAdminUser(): UserProfile | null {
  return adminSession.user
}

// Check if admin is authenticated
export function isAdminAuthenticated(): boolean {
  return adminSession.isAuthenticated
}

// Admin logout
export function adminLogout(): void {
  adminSession = {
    user: null,
    isAuthenticated: false
  }
}