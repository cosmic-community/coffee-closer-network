import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createBucketClient } from '@cosmicjs/sdk'
import { createSession, setSessionCookie } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, email, password, currentRole, company, seniorityLevel, industryVertical, bio } = body
    
    console.log('Signup attempt for:', email)
    
    // Validate required fields
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

    // Validate environment variables
    const bucketSlug = process.env.COSMIC_BUCKET_SLUG
    const readKey = process.env.COSMIC_READ_KEY
    const writeKey = process.env.COSMIC_WRITE_KEY
    
    console.log('Environment check:', {
      hasBucketSlug: !!bucketSlug,
      hasReadKey: !!readKey,
      hasWriteKey: !!writeKey,
      bucketSlugLength: bucketSlug?.length || 0,
      writeKeyLength: writeKey?.length || 0
    })

    if (!bucketSlug || !readKey || !writeKey) {
      console.error('Missing environment variables:', {
        bucketSlug: !!bucketSlug,
        readKey: !!readKey,
        writeKey: !!writeKey
      })
      return NextResponse.json(
        { error: 'Server configuration error. Please contact support.' },
        { status: 500 }
      )
    }

    // Create Cosmic client
    const cosmic = createBucketClient({
      bucketSlug,
      readKey,
      writeKey,
    })

    // Check if user already exists
    try {
      console.log('Checking for existing user...')
      const existingUsers = await cosmic.objects.find({
        type: 'user-profiles',
        'metadata.email': email.trim().toLowerCase()
      }).props(['id'])

      if (existingUsers.objects && existingUsers.objects.length > 0) {
        console.log('User already exists')
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 409 }
        )
      }
    } catch (error: any) {
      console.log('Error checking existing user:', error.message, 'Status:', error.status)
      if (error.status !== 404) {
        console.error('Unexpected error checking existing user:', error)
        return NextResponse.json(
          { error: 'Failed to check existing user' },
          { status: 500 }
        )
      }
      // 404 is expected when no users exist with this email
      console.log('No existing users found (404 expected)')
    }

    // Hash password
    console.log('Hashing password...')
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Generate slug
    const slug = fullName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + Math.random().toString(36).substr(2, 9)

    console.log('Generated slug:', slug)

    // Prepare metadata
    const metadata = {
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      password_hash: hashedPassword,
      current_role: currentRole.trim(),
      company: company?.trim() || '',
      seniority_level: {
        key: seniorityLevel,
        value: getSeniorityLevelValue(seniorityLevel)
      },
      industry_vertical: {
        key: industryVertical,
        value: getIndustryVerticalValue(industryVertical)
      },
      bio: bio?.trim() || '',
      timezone: {
        key: 'EST',
        value: 'Eastern Time (EST/EDT)'
      },
      sales_focus: {
        key: 'MID_MARKET',
        value: 'Mid-Market'
      },
      preferred_chat_times: [],
      topics_to_discuss: [],
      async_communication: false
    }

    console.log('Creating user with metadata keys:', Object.keys(metadata))

    // Create user profile in Cosmic
    console.log('Inserting user into Cosmic...')
    const userProfile = await cosmic.objects.insertOne({
      title: fullName.trim(),
      slug: slug,
      type: 'user-profiles',
      metadata: metadata
    })

    console.log('User created successfully with ID:', userProfile.object.id)

    // Create session
    const sessionUser = {
      id: userProfile.object.id,
      email: email.trim().toLowerCase(),
      fullName: fullName.trim(),
      isAdmin: false
    }

    console.log('Creating session for user:', sessionUser.id)
    
    try {
      const token = await createSession(sessionUser)
      const response = NextResponse.json({
        success: true,
        message: 'Account created successfully!',
        user: sessionUser
      }, { status: 201 })
      
      await setSessionCookie(response, token)
      
      console.log('Session created successfully')
      return response
    } catch (sessionError: any) {
      console.error('Session creation error:', sessionError)
      // Still return success since user was created
      return NextResponse.json({
        success: true,
        message: 'Account created successfully! Please log in.',
        user: sessionUser
      }, { status: 201 })
    }
    
  } catch (error: any) {
    console.error('Signup error details:', {
      message: error.message,
      status: error.status,
      code: error.code,
      stack: error.stack?.split('\n').slice(0, 3)
    })
    
    // More specific error handling
    if (error.message?.includes('writeKey')) {
      return NextResponse.json(
        { error: 'Server configuration error. Please contact support.' },
        { status: 500 }
      )
    } else if (error.status === 400 || error.status === 409) {
      return NextResponse.json(
        { error: error.message || 'Invalid request' },
        { status: error.status }
      )
    } else if (error.message?.includes('already exists')) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    } else {
      return NextResponse.json(
        { error: 'An unexpected error occurred during signup. Please try again.' },
        { status: 500 }
      )
    }
  }
}

function getSeniorityLevelValue(key: string): string {
  const levels: Record<string, string> = {
    'SDR': 'SDR (Sales Development Rep)',
    'BDR': 'BDR (Business Development Rep)',
    'AE': 'AE (Account Executive)',
    'SR_AE': 'Senior Account Executive',
    'AM': 'Account Manager',
    'CSM': 'Customer Success Manager',
    'MANAGER': 'Sales Manager',
    'DIRECTOR': 'Sales Director',
    'VP': 'VP of Sales'
  }
  return levels[key] || key
}

function getIndustryVerticalValue(key: string): string {
  const industries: Record<string, string> = {
    'SAAS': 'SaaS',
    'FINTECH': 'Fintech',
    'HEALTHCARE': 'Healthcare',
    'EDTECH': 'EdTech',
    'ECOMMERCE': 'E-commerce',
    'MARTECH': 'MarTech',
    'CYBERSECURITY': 'Cybersecurity',
    'OTHER': 'Other'
  }
  return industries[key] || key
}