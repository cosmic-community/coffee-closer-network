import { NextRequest, NextResponse } from 'next/server'
import { cosmic } from '@/lib/cosmic'
import bcrypt from 'bcryptjs'

interface SignupData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  profileData: {
    title: string
    slug: string
    current_role: string
    company: string
    linkedin_url?: string
    bio: string
    fun_fact?: string
    timezone: {
      key: string
      value: string
    }
    seniority_level: {
      key: string
      value: string
    }
    sales_focus?: {
      key: string
      value: string
    }
    industry_vertical?: {
      key: string
      value: string
    }
    preferred_chat_times: string[]
    topics_to_discuss: string[]
    async_communication: boolean
    profile_complete: boolean
    account_status: {
      key: string
      value: string
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const signupData: SignupData = await request.json()
    
    console.log('Received signup data:', {
      email: signupData.email,
      fullName: signupData.fullName,
      bucketSlug: process.env.COSMIC_BUCKET_SLUG
    })

    // Validate that we're using the correct bucket
    if (process.env.COSMIC_BUCKET_SLUG !== 'coffee-closers-production') {
      console.error('Incorrect bucket slug configured:', process.env.COSMIC_BUCKET_SLUG)
      return NextResponse.json(
        { message: 'Server configuration error. Please contact support.' },
        { status: 500 }
      )
    }

    // Validate required fields
    if (!signupData.fullName?.trim()) {
      return NextResponse.json(
        { message: 'Full name is required' },
        { status: 400 }
      )
    }

    if (!signupData.email?.trim()) {
      return NextResponse.json(
        { message: 'Email address is required' },
        { status: 400 }
      )
    }

    if (!signupData.password?.trim()) {
      return NextResponse.json(
        { message: 'Password is required' },
        { status: 400 }
      )
    }

    if (!signupData.profileData?.current_role?.trim()) {
      return NextResponse.json(
        { message: 'Current role is required' },
        { status: 400 }
      )
    }

    if (!signupData.profileData?.company?.trim()) {
      return NextResponse.json(
        { message: 'Company is required' },
        { status: 400 }
      )
    }

    if (!signupData.profileData?.bio?.trim()) {
      return NextResponse.json(
        { message: 'Bio is required' },
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

    // Check if user already exists
    try {
      const existingUser = await cosmic.objects.find({
        type: 'user-profiles',
        'metadata.email_address': signupData.email
      })
      
      if (existingUser.objects && existingUser.objects.length > 0) {
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

    // Create user profile in Cosmic with properly mapped fields
    const userData = {
      title: signupData.fullName,
      type: 'user-profiles',
      status: 'published',
      slug: signupData.profileData.slug,
      metadata: {
        full_name: signupData.fullName,
        email_address: signupData.email,
        password_hash: passwordHash,
        current_role: signupData.profileData.current_role,
        company: signupData.profileData.company,
        linkedin_url: signupData.profileData.linkedin_url || '',
        bio: signupData.profileData.bio,
        fun_fact: signupData.profileData.fun_fact || '',
        timezone: signupData.profileData.timezone,
        seniority_level: signupData.profileData.seniority_level,
        sales_focus: signupData.profileData.sales_focus,
        industry_vertical: signupData.profileData.industry_vertical,
        preferred_chat_times: signupData.profileData.preferred_chat_times,
        topics_to_discuss: signupData.profileData.topics_to_discuss,
        async_communication: signupData.profileData.async_communication,
        profile_complete: signupData.profileData.profile_complete,
        account_status: signupData.profileData.account_status
      }
    }

    console.log('Creating user profile in coffee-closers-production bucket:', { 
      email: signupData.email, 
      slug: signupData.profileData.slug,
      bucketSlug: process.env.COSMIC_BUCKET_SLUG
    })

    const response = await cosmic.objects.insertOne(userData)
    
    console.log('Successfully created profile:', {
      id: response.object?.id,
      slug: response.object?.slug,
      email: signupData.email,
      bucketSlug: process.env.COSMIC_BUCKET_SLUG
    })

    // Return success without sensitive data
    return NextResponse.json({
      message: 'Account created successfully',
      user: {
        id: response.object?.id,
        slug: response.object?.slug,
        fullName: signupData.fullName,
        email: signupData.email,
        needsProfileSetup: false
      }
    })

  } catch (error: any) {
    console.error('Detailed signup error:', {
      message: error.message,
      status: error.status,
      response: error.response?.data,
      stack: error.stack,
      bucketSlug: process.env.COSMIC_BUCKET_SLUG
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
        { message: 'Configuration error: Cosmic bucket "coffee-closers-production" not found. Please check your COSMIC_BUCKET_SLUG environment variable.' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { message: `Failed to create account: ${error.message || 'Unknown error'}` },
      { status: 500 }
    )
  }
}