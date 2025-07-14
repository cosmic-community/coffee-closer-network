import { NextRequest, NextResponse } from 'next/server'
import { cosmicAuth } from '@/lib/cosmic-auth'
import { hashPassword } from '@/lib/password-utils'
import { createSession, createSessionResponse } from '@/lib/session'
import { validateSignupData } from '@/lib/validation'

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
    
    console.log('Received signup data:', {
      email: signupData.email,
      fullName: signupData.fullName,
      currentRole: signupData.currentRole,
      company: signupData.company,
      seniorityLevel: signupData.seniorityLevel,
      industryVertical: signupData.industryVertical,
      bioLength: signupData.bio?.length || 0,
      terms: signupData.terms
    })

    // Validate required fields
    const validation = validateSignupData(signupData)
    if (!validation.isValid) {
      console.log('Validation errors:', validation.errors)
      return NextResponse.json(
        { error: validation.errors[0] },
        { status: 400 }
      )
    }

    // Check if user already exists by searching user-profiles
    try {
      const existingUser = await cosmicAuth.objects.find({
        type: 'user-profiles',
        'metadata.email_address': signupData.email.trim().toLowerCase()
      }).props(['id', 'slug', 'metadata'])

      if (existingUser.objects && existingUser.objects.length > 0) {
        return NextResponse.json(
          { error: 'A user with this email already exists' },
          { status: 409 }
        )
      }
    } catch (error: any) {
      // If 404, no user exists (this is expected for new users)
      if (error.status !== 404) {
        console.error('Error checking existing user:', error)
        return NextResponse.json(
          { error: 'Error checking user existence' },
          { status: 500 }
        )
      }
    }

    // Hash password
    const passwordHash = await hashPassword(signupData.password)

    // Generate slug from full name
    const slug = signupData.fullName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

    // Create user profile object
    const userProfileData = {
      title: signupData.fullName,
      slug: slug,
      type: 'user-profiles',
      status: 'published',
      metadata: {
        full_name: signupData.fullName,
        email_address: signupData.email.trim().toLowerCase(),
        current_role: signupData.currentRole,
        company: signupData.company,
        bio: signupData.bio || '',
        timezone: {
          key: 'EST',
          value: 'Eastern Time (EST/EDT)'
        },
        seniority_level: {
          key: signupData.seniorityLevel,
          value: getSeniorityLevelValue(signupData.seniorityLevel)
        },
        industry_vertical: {
          key: signupData.industryVertical,
          value: getIndustryVerticalValue(signupData.industryVertical)
        },
        preferred_chat_times: [],
        topics_to_discuss: [],
        async_communication: false,
        profile_complete: true,
        account_status: {
          key: 'ACTIVE',
          value: 'Active'
        }
      }
    }

    // Create user account object
    const userAccountData = {
      title: signupData.email.trim().toLowerCase(),
      slug: signupData.email.trim().toLowerCase().replace(/[@.]/g, ''),
      type: 'user-accounts',
      status: 'published',
      metadata: {
        email: signupData.email.trim().toLowerCase(),
        password_hash: passwordHash,
        email_verified: false,
        created_at: new Date().toISOString().split('T')[0],
        is_active: true,
        role: {
          key: 'user',
          value: 'User'
        },
        user_status: {
          key: 'ACTIVE',
          value: 'Active'
        },
        failed_login_attempts: 0,
        two_factor_enabled: false,
        privacy_settings: {
          profile_visible: true,
          allow_direct_contact: true,
          show_in_directory: true,
          data_sharing_consent: false
        }
      }
    }

    console.log('Creating user profile...')
    const profileResponse = await cosmicAuth.objects.insertOne(userProfileData)
    
    console.log('Creating user account...')
    const accountResponse = await cosmicAuth.objects.insertOne(userAccountData)
    
    console.log('Successfully created user:', {
      profileId: profileResponse.object?.id,
      accountId: accountResponse.object?.id,
      email: signupData.email
    })

    // Create session
    const sessionUser = {
      id: profileResponse.object?.id || '',
      email: signupData.email.trim().toLowerCase(),
      fullName: signupData.fullName,
      isAdmin: false
    }

    const token = await createSession(sessionUser)
    return createSessionResponse({
      success: true,
      message: 'Account created successfully',
      user: sessionUser
    }, token)

  } catch (error: any) {
    console.error('Signup error:', error)
    
    // Handle specific Cosmic API errors
    if (error.status === 400) {
      return NextResponse.json(
        { error: 'Invalid data provided. Please check your form inputs.' },
        { status: 400 }
      )
    } else if (error.status === 401) {
      return NextResponse.json(
        { error: 'Authentication failed. Please check your API credentials.' },
        { status: 401 }
      )
    } else if (error.status === 403) {
      return NextResponse.json(
        { error: 'Permission denied. Please check your API permissions.' },
        { status: 403 }
      )
    }
    
    return NextResponse.json(
      { error: `Failed to create account: ${error.message || 'Unknown error'}` },
      { status: 500 }
    )
  }
}

function getSeniorityLevelValue(key: string): string {
  const levels: Record<string, string> = {
    'SDR': 'SDR (Sales Development Rep)',
    'AE': 'Account Executive',
    'SR_AE': 'Senior Account Executive',
    'MANAGER': 'Sales Manager',
    'VP': 'VP of Sales',
    'OTHER': 'Other'
  }
  return levels[key] || key
}

function getIndustryVerticalValue(key: string): string {
  const industries: Record<string, string> = {
    'SAAS': 'SaaS',
    'FINTECH': 'Fintech',
    'HEALTHCARE': 'Healthcare',
    'MANUFACTURING': 'Manufacturing',
    'RETAIL': 'Retail',
    'REAL_ESTATE': 'Real Estate',
    'TECHNOLOGY': 'Technology',
    'OTHER': 'Other'
  }
  return industries[key] || key
}