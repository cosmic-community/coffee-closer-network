import { NextRequest, NextResponse } from 'next/server'
import { createBucketClient } from '@cosmicjs/sdk'
import { createSession, createSessionResponse } from '@/lib/session'
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

    // Check environment variables
    const bucketSlug = process.env.COSMIC_BUCKET_SLUG
    const readKey = process.env.COSMIC_READ_KEY
    
    if (!bucketSlug || !readKey) {
      console.error('Missing environment variables')
      return NextResponse.json(
        { error: 'Server configuration error. Please contact support.' },
        { status: 500 }
      )
    }

    // Create Cosmic client (read-only for login)
    const cosmic = createBucketClient({
      bucketSlug,
      readKey,
    })

    // Find user by email
    try {
      const response = await cosmic.objects.find({
        type: 'user-profiles',
        'metadata.email': body.email.trim().toLowerCase()
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
      const isValidPassword = await verifyPassword(body.password, storedHash)
      
      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        )
      }

      // Create session
      const sessionUser = {
        id: userObject.id,
        email: body.email.trim().toLowerCase(),
        fullName: userObject.metadata?.full_name || userObject.title,
        isAdmin: false
      }

      const token = await createSession(sessionUser)
      return createSessionResponse({
        success: true,
        message: 'Login successful',
        user: sessionUser
      }, token)

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