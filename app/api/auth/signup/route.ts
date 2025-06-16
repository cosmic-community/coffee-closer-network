import { NextRequest, NextResponse } from 'next/server'

// Simple password hashing (in production, use bcrypt)
function hashPassword(password: string): string {
  return btoa(password + 'coffee-salt-2024')
}

// Generate unique ID
function generateId(): string {
  return 'user_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

// Simple in-memory user storage (in production, use a proper database)
// This will be replaced with a proper shared storage solution
const users: Array<{
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
}> = []

// Add admin user for testing
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

export async function POST(request: NextRequest) {
  try {
    console.log('Signup API called')
    
    const body = await request.json()
    console.log('Request body received:', { ...body, password: '[REDACTED]' })
    
    // Validate required fields
    const { fullName, email, password, currentRole, company, seniorityLevel, industryVertical, bio } = body
    
    const errors: string[] = []
    
    if (!fullName?.trim()) errors.push('Full name is required')
    if (!email?.trim()) errors.push('Email is required')
    if (!password?.trim()) errors.push('Password is required')
    if (!currentRole?.trim()) errors.push('Current role is required')
    if (!seniorityLevel?.trim()) errors.push('Seniority level is required')
    if (!industryVertical?.trim()) errors.push('Industry vertical is required')
    
    if (errors.length > 0) {
      console.log('Validation errors:', errors)
      return NextResponse.json(
        { error: errors.join(', ') },
        { status: 400 }
      )
    }
    
    // Check if user already exists
    const existingUser = users.find(user => 
      user.email.toLowerCase() === email.trim().toLowerCase()
    )
    
    if (existingUser) {
      console.log('User already exists with email:', email)
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }
    
    // Create new user
    const newUser = {
      id: generateId(),
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password: hashPassword(password.trim()),
      currentRole: currentRole.trim(),
      company: company?.trim() || '',
      seniorityLevel: seniorityLevel.trim(),
      industryVertical: industryVertical.trim(),
      bio: bio?.trim() || '',
      createdAt: new Date().toISOString()
    }
    
    // Add user to storage
    users.push(newUser)
    
    console.log('User created successfully:', newUser.id)
    console.log('Total users now:', users.length)
    
    // Return success response (without password)
    const { password: _, ...safeUser } = newUser
    
    return NextResponse.json({
      success: true,
      message: 'Account created successfully! You can now log in.',
      user: safeUser
    }, { status: 201 })
    
  } catch (error: any) {
    console.error('Signup API error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    
    return NextResponse.json(
      { error: 'An unexpected error occurred during signup. Please try again.' },
      { status: 500 }
    )
  }
}

// Helper function to get users (for login route to access)
export function getUsers() {
  return users
}