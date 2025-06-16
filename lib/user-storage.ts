// Shared user storage system
// In production, this would be replaced with a proper database

interface StoredUser {
  id: string
  fullName: string
  email: string
  password: string
  currentRole: string
  company: string
  seniorityLevel: string
  industryVertical: string
  bio: string
  createdAt: string
}

// Simple password hashing (in production, use bcrypt)
export function hashPassword(password: string): string {
  return btoa(password + 'coffee-salt-2024')
}

// Verify password
export function verifyPassword(password: string, hashedPassword: string): boolean {
  const hashed = hashPassword(password)
  return hashed === hashedPassword
}

// Generate unique ID
export function generateId(): string {
  return 'user_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

// In-memory storage (shared across API routes)
let users: StoredUser[] = []

// Initialize with admin user
if (users.length === 0) {
  users.push({
    id: 'admin_user',
    fullName: 'Administrator',
    email: 'admin',
    password: hashPassword('admin'),
    currentRole: 'Administrator',
    company: 'Coffee Closer Network',
    seniorityLevel: 'Senior',
    industryVertical: 'Technology',
    bio: 'System administrator',
    createdAt: new Date().toISOString()
  })
}

export class UserStorage {
  static getAllUsers(): Omit<StoredUser, 'password'>[] {
    return users.map(({ password, ...user }) => user)
  }

  static findUserByEmail(email: string): StoredUser | undefined {
    return users.find(user => 
      user.email.toLowerCase() === email.trim().toLowerCase()
    )
  }

  static createUser(userData: {
    fullName: string
    email: string
    password: string
    currentRole: string
    company: string
    seniorityLevel: string
    industryVertical: string
    bio: string
  }): StoredUser {
    // Check if user already exists
    const existingUser = this.findUserByEmail(userData.email)
    if (existingUser) {
      throw new Error('An account with this email already exists')
    }

    const newUser: StoredUser = {
      id: generateId(),
      fullName: userData.fullName.trim(),
      email: userData.email.trim().toLowerCase(),
      password: hashPassword(userData.password.trim()),
      currentRole: userData.currentRole.trim(),
      company: userData.company?.trim() || '',
      seniorityLevel: userData.seniorityLevel.trim(),
      industryVertical: userData.industryVertical.trim(),
      bio: userData.bio?.trim() || '',
      createdAt: new Date().toISOString()
    }

    users.push(newUser)
    return newUser
  }

  static authenticateUser(email: string, password: string): Omit<StoredUser, 'password'> | null {
    const user = this.findUserByEmail(email)
    
    if (!user) {
      return null
    }

    if (!verifyPassword(password, user.password)) {
      return null
    }

    // Return user without password
    const { password: _, ...safeUser } = user
    return safeUser
  }

  static getUserCount(): number {
    return users.length
  }

  static getUserById(id: string): Omit<StoredUser, 'password'> | undefined {
    const user = users.find(u => u.id === id)
    if (!user) return undefined
    
    const { password, ...safeUser } = user
    return safeUser
  }
}