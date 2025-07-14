import { NextRequest, NextResponse } from 'next/server'
import { createUserProfile, checkUserExists } from '@/lib/cosmic'
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
      fullName: signupData.fullName
    })

    // Validate required fields
    const validation = validateSignupData(signupData)
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.errors[0] },
        { status: 400 }
      )
    }

    // Check if user already exists
    const userExists = await checkUserExists(signupData.email)
    if (userExists) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 409 }
      )
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

    // Create user profile
    const userData = {
      title: signupData.fullName,
      slug: slug,
      metadata: {
        full_name: signupData.fullName,
        email_address: signupData.email.trim().toLowerCase(),
        password_hash: passwordHash,
        current_role: signupData.currentRole,
        company: signupData.company,
        bio: signupData.bio,
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

    const response = await createUserProfile(userData)
    
    console.log('Successfully created profile:', {
      id: response.object?.id,
      slug: response.object?.slug,
      email: signupData.email
    })

    // Create session
    const sessionUser = {
      id: response.object?.id || '',
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