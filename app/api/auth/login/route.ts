import { NextRequest, NextResponse } from 'next/server'
import { adminLogin } from '@/lib/admin-auth'

// Import users from signup route
let users: Array<{
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

// Simple password verification
function verifyPassword(password: string, hashedPassword: string): boolean {
  const hashed = btoa(password + 'coffee-salt-2024')
  return hashed === hashedPassword
}

export async function POST(request: NextRequest) {
  try {
    console.log('Login API called')
    
    const body = await request.json()
    const { email, password } = body
    
    console.log('Login attempt for:', email)
    
    if (!email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }
    
    // Check for admin credentials first
    if (email.toLowerCase() === 'admin' || email.toLowerCase() === 'admin@coffeecloser.network') {
      try {
        const adminUser = await adminLogin('admin', password)
        console.log('Admin login successful')
        
        return NextResponse.json({
          success: true,
          message: 'Admin login successful',
          user: {
            id: adminUser.id,
            fullName: adminUser.metadata.full_name,
            email: adminUser.metadata.email,
            currentRole: adminUser.metadata.current_role,
            company: adminUser.metadata.company,
            isAdmin: true
          }
        })
      } catch (adminError) {
        console.log('Admin login failed, trying regular user login')
      }
    }
    
    // Try to find regular user
    const user = users.find(u => 
      u.email.toLowerCase() === email.trim().toLowerCase()
    )
    
    if (!user) {
      console.log('User not found:', email)
      console.log('Available users:', users.map(u => u.email))
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Verify password
    if (!verifyPassword(password, user.password)) {
      console.log('Password verification failed for:', email)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    console.log('User login successful:', user.id)
    
    // Return user data (without password)
    const { password: _, ...safeUser } = user
    
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        ...safeUser,
        isAdmin: false
      }
    })
    
  } catch (error: any) {
    console.error('Login API error:', {
      message: error.message,
      stack: error.stack
    })
    
    return NextResponse.json(
      { error: 'An error occurred during login. Please try again.' },
      { status: 500 }
    )
  }
}