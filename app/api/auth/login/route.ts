import { NextRequest, NextResponse } from 'next/server'
import { signIn } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { email, password } = body
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Sign in user
    const user = await signIn(email, password)

    // Return user data (without password hash)
    const { password_hash, ...userMetadata } = user.metadata
    
    return NextResponse.json({
      success: true,
      user: {
        ...user,
        metadata: userMetadata
      }
    })
  } catch (error) {
    console.error('Login API error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'An error occurred during login'
    const statusCode = errorMessage.includes('Invalid email or password') ? 401 : 500
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    )
  }
}