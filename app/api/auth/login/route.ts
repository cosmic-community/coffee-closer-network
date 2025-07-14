import { NextRequest, NextResponse } from 'next/server'
import { createSession, createSessionResponse } from '@/lib/session'
import { getUserProfileByEmail } from '@/lib/cosmic'
import { verifyPassword } from '@/lib/password-utils'
import { validateLoginData } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('Login attempt for:', body.email)
    
    // Validate input data
    const validation = validateLoginData(body)
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.errors[0] },
        { status: 400 }
      )
    }

    // Check for admin credentials first
    if (body.email.toLowerCase() === 'admin' && body.password === 'admin') {
      const adminUser = {
        id: 'admin',
        email: 'admin@coffeecloser.network',
        fullName: 'Administrator',
        isAdmin: true
      }

      const token = await createSession(adminUser)
      return createSessionResponse({
        success: true,
        message: 'Admin login successful',
        user: adminUser
      }, token)
    }

    // Find user profile by email
    const userProfile = await getUserProfileByEmail(body.email.trim().toLowerCase())
    
    if (!userProfile) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if user has password hash
    const storedHash = userProfile.metadata?.password_hash
    if (!storedHash) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await verifyPassword(body.password, storedHash)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create session
    const sessionUser = {
      id: userProfile.id,
      email: userProfile.metadata?.email_address || body.email.trim().toLowerCase(),
      fullName: userProfile.metadata?.full_name || userProfile.title,
      isAdmin: false
    }

    const token = await createSession(sessionUser)
    return createSessionResponse({
      success: true,
      message: 'Login successful',
      user: sessionUser
    }, token)

  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'An error occurred during login. Please try again.' },
      { status: 500 }
    )
  }
}