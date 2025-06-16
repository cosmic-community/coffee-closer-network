import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createBucketClient } from '@cosmicjs/sdk'
import { createSession, setSessionCookie } from '@/lib/session'

const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG || '',
  readKey: process.env.COSMIC_READ_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body
    
    if (!email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check for admin credentials
    if (email.toLowerCase() === 'admin' && password === 'admin') {
      const adminUser = {
        id: 'admin',
        email: 'admin@coffeecloser.network',
        fullName: 'Administrator',
        isAdmin: true
      }

      const token = await createSession(adminUser)
      await setSessionCookie(token)

      return NextResponse.json({
        success: true,
        message: 'Admin login successful',
        user: adminUser
      })
    }

    // Find user by email
    try {
      const response = await cosmic.objects.find({
        type: 'user-profiles',
        'metadata.email': email.trim().toLowerCase()
      }).props(['id', 'title', 'metadata']).depth(1)

      if (!response.objects || response.objects.length === 0) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        )
      }

      const userObject = response.objects[0]
      const storedHash = userObject.metadata?.password_hash

      if (!storedHash) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        )
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, storedHash)
      
      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        )
      }

      // Create session
      const sessionUser = {
        id: userObject.id,
        email: email.trim().toLowerCase(),
        fullName: userObject.metadata?.full_name || userObject.title,
        isAdmin: false
      }

      const token = await createSession(sessionUser)
      await setSessionCookie(token)

      return NextResponse.json({
        success: true,
        message: 'Login successful',
        user: sessionUser
      })

    } catch (error: any) {
      if (error.status === 404) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        )
      }
      throw error
    }
    
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'An error occurred during login. Please try again.' },
      { status: 500 }
    )
  }
}