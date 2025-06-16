import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createBucketClient } from '@cosmicjs/sdk'
import { createSession, setSessionCookie } from '@/lib/session'

const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG || '',
  readKey: process.env.COSMIC_READ_KEY || '',
  writeKey: process.env.COSMIC_WRITE_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, email, password, currentRole, company, seniorityLevel, industryVertical, bio } = body
    
    // Validate required fields
    const errors: string[] = []
    
    if (!fullName?.trim()) errors.push('Full name is required')
    if (!email?.trim()) errors.push('Email is required')
    if (!password?.trim()) errors.push('Password is required')
    if (!currentRole?.trim()) errors.push('Current role is required')
    if (!seniorityLevel?.trim()) errors.push('Seniority level is required')
    if (!industryVertical?.trim()) errors.push('Industry vertical is required')
    
    if (errors.length > 0) {
      return NextResponse.json(
        { error: errors.join(', ') },
        { status: 400 }
      )
    }

    // Check if user already exists
    try {
      const existingUsers = await cosmic.objects.find({
        type: 'user-profiles',
        'metadata.email': email.trim().toLowerCase()
      }).props(['id'])

      if (existingUsers.objects && existingUsers.objects.length > 0) {
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
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate slug
    const slug = fullName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + Math.random().toString(36).substr(2, 9)

    // Create user profile in Cosmic
    const userProfile = await cosmic.objects.insertOne({
      title: fullName.trim(),
      slug: slug,
      type: 'user-profiles',
      metadata: {
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
    })

    // Create session
    const sessionUser = {
      id: userProfile.object.id,
      email: email.trim().toLowerCase(),
      fullName: fullName.trim(),
      isAdmin: false
    }

    const token = await createSession(sessionUser)
    await setSessionCookie(token)

    return NextResponse.json({
      success: true,
      message: 'Account created successfully!',
      user: sessionUser
    }, { status: 201 })
    
  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred during signup. Please try again.' },
      { status: 500 }
    )
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