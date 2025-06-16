import { NextRequest, NextResponse } from 'next/server'
import { UserStorage } from '@/lib/user-storage'
import { adminLogin } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    console.log('Login API called')
    
    const body = await request.json()
    const { email, password } = body
    
    console.log('Login attempt for:', email)
    console.log('Available users:', UserStorage.getAllUsers().map(u => u.email))
    
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
    
    // Try to authenticate user using shared storage
    const authenticatedUser = UserStorage.authenticateUser(email, password)
    
    if (!authenticatedUser) {
      console.log('Authentication failed for:', email)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    console.log('User login successful:', authenticatedUser.id)
    
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        ...authenticatedUser,
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