import { NextRequest, NextResponse } from 'next/server'
import { createBucketClient } from '@cosmicjs/sdk'
import { createSession, createSessionResponse } from '@/lib/session'
import { hashPassword } from '@/lib/password-utils'
import { validateSignupData } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('Signup attempt for:', body.email)
    
    // Validate input data
    const validation = validateSignupData(body)
    if (!validation.isValid) {
      console.log('Validation errors:', validation.errors)
      return NextResponse.json(
        { error: validation.errors[0] },
        { status: 400 }
      )
    }

    // Check environment variables
    const bucketSlug = process.env.COSMIC_BUCKET_SLUG
    const readKey = process.env.COSMIC_READ_KEY
    const writeKey = process.env.COSMIC_WRITE_KEY
    
    if (!bucketSlug || !readKey || !writeKey) {
      console.error('Missing environment variables')
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
        'metadata.email': body.email.trim().toLowerCase()
      }).props(['id'])

      if (existingUsers.objects && existingUsers.objects.length > 0) {
        console.log('User already exists')
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 409 }
        )
      }
    } catch (error: any) {
      if (error.status !== 404) {
        console.error('Error checking existing user:', error)
        return NextResponse.json(
          { error: 'Failed to check existing user' },
          { status: 500 }
        )
      }
      // 404 is expected when no users exist
    }

    // Hash password
    console.log('Hashing password...')
    const hashedPassword = await hashPassword(body.password)

    // Generate slug
    const slug = body.fullName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + Math.random().toString(36).substr(2, 9)

    // Prepare metadata
    const metadata = {
      full_name: body.fullName.trim(),
      email: body.email.trim().toLowerCase(),
      password_hash: hashedPassword,
      current_role: body.currentRole.trim(),
      company: body.company?.trim() || '',
      seniority_level: {
        key: body.seniorityLevel,
        value: getSeniorityLevelValue(body.seniorityLevel)
      },
      industry_vertical: {
        key: body.industryVertical,
        value: getIndustryVerticalValue(body.industryVertical)
      },
      bio: body.bio?.trim() || '',
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

    console.log('Creating user in Cosmic...')
    
    // Create user profile in Cosmic
    const userProfile = await cosmic.objects.insertOne({
      title: body.fullName.trim(),
      slug: slug,
      type: 'user-profiles',
      metadata: metadata
    })

    console.log('User created successfully with ID:', userProfile.object.id)

    // Create session
    const sessionUser = {
      id: userProfile.object.id,
      email: body.email.trim().toLowerCase(),
      fullName: body.fullName.trim(),
      isAdmin: false
    }

    console.log('Creating session...')
    const token = await createSession(sessionUser)
    
    return createSessionResponse({
      success: true,
      message: 'Account created successfully!',
      user: sessionUser
    }, token)
    
  } catch (error: any) {
    console.error('Signup error:', error)
    
    if (error.message?.includes('Server configuration error')) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    } else if (error.message?.includes('already exists')) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    } else if (error.status === 400 || error.status === 409) {
      return NextResponse.json(
        { error: error.message || 'Invalid request' },
        { status: error.status }
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