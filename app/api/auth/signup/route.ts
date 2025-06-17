import { NextRequest, NextResponse } from 'next/server'
import { cosmic } from '@/lib/cosmic'
import bcrypt from 'bcryptjs'

interface SignupData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  currentRole: string
  company: string
  seniorityLevel: string
  industryVertical: string
  bio: string
  terms: boolean
}

export async function POST(request: NextRequest) {
  try {
    const signupData: SignupData = await request.json()
    
    console.log('Received basic signup data:', {
      email: signupData.email,
      fullName: signupData.fullName,
      company: signupData.company
    })

    // Validate required fields
    if (!signupData.fullName || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(signupData.email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password match
    if (signupData.password !== signupData.confirmPassword) {
      return NextResponse.json(
        { message: 'Passwords do not match' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (signupData.password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Validate terms acceptance
    if (!signupData.terms) {
      return NextResponse.json(
        { message: 'You must accept the terms and conditions' },
        { status: 400 }
      )
    }

    // Check if user already exists
    try {
      const existingUser = await cosmic.objects.findOne({
        type: 'user-profiles',
        'metadata.email': signupData.email
      })
      
      if (existingUser) {
        return NextResponse.json(
          { message: 'A user with this email already exists' },
          { status: 409 }
        )
      }
    } catch (error: any) {
      // If 404, user doesn't exist - continue with creation
      if (error?.status !== 404) {
        console.error('Error checking for existing user:', error)
        throw error
      }
    }

    // Hash password
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(signupData.password, saltRounds)

    // Generate slug from full name
    const slug = signupData.fullName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

    // Create user profile in Cosmic
    const userData = {
      title: signupData.fullName,
      type: 'user-profiles',
      status: 'published',
      slug: slug,
      metadata: {
        full_name: signupData.fullName,
        email: signupData.email,
        password_hash: passwordHash,
        current_role: signupData.currentRole,
        company: signupData.company,
        seniority_level: {
          key: signupData.seniorityLevel.toUpperCase().replace(/\s+/g, '_'),
          value: signupData.seniorityLevel
        },
        industry_vertical: {
          key: signupData.industryVertical.toUpperCase().replace(/\s+/g, '_'),
          value: signupData.industryVertical
        },
        bio: signupData.bio,
        profile_complete: false
      }
    }

    console.log('Creating basic user profile:', { email: signupData.email, slug })

    const response = await cosmic.objects.insertOne(userData)
    
    console.log('Successfully created basic profile:', {
      id: response.object?.id,
      slug: response.object?.slug,
      email: signupData.email
    })

    // Return success without sensitive data
    return NextResponse.json({
      message: 'Account created successfully',
      user: {
        id: response.object?.id,
        slug: response.object?.slug,
        fullName: signupData.fullName,
        email: signupData.email,
        needsProfileSetup: true
      }
    })

  } catch (error: any) {
    console.error('Detailed signup error:', {
      message: error.message,
      status: error.status,
      response: error.response?.data,
      stack: error.stack
    })
    
    // Provide more specific error messages
    if (error.status === 400) {
      return NextResponse.json(
        { message: 'Invalid data provided. Please check your form inputs.' },
        { status: 400 }
      )
    } else if (error.status === 401) {
      return NextResponse.json(
        { message: 'Authentication failed. Please check your API credentials.' },
        { status: 401 }
      )
    } else if (error.status === 403) {
      return NextResponse.json(
        { message: 'Permission denied. Please check your API permissions.' },
        { status: 403 }
      )
    } else if (error.status === 404 && error.message?.includes('bucket')) {
      return NextResponse.json(
        { message: 'Configuration error: Cosmic bucket not found. Please check your COSMIC_BUCKET_SLUG environment variable.' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { message: `Failed to create account: ${error.message || 'Unknown error'}` },
      { status: 500 }
    )
  }
}