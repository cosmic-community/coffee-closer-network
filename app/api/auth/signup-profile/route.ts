import { NextRequest, NextResponse } from 'next/server'
import { cosmic } from '@/lib/cosmic'
import bcrypt from 'bcryptjs'

interface UserProfileData {
  title: string
  type: string
  status: string
  slug: string
  metadata: {
    full_name: string
    email_address: string
    password_hash?: string
    profile_picture?: {
      url: string
      imgix_url: string
    }
    current_role: string
    company: string
    linkedin_url?: string
    bio?: string
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
    preferred_chat_times?: string[]
    topics_to_discuss?: string[]
    async_communication?: boolean
    profile_complete?: boolean
    account_status?: {
      key: string
      value: string
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const userData: UserProfileData = await request.json()
    
    console.log('Received signup profile data:', {
      title: userData.title,
      type: userData.type,
      slug: userData.slug,
      email: userData.metadata.email_address
    })

    // Validate required fields according to the content model
    if (!userData.metadata.full_name || !userData.metadata.email_address || !userData.metadata.current_role || !userData.metadata.company || !userData.metadata.timezone?.value || !userData.metadata.seniority_level?.value) {
      return NextResponse.json(
        { message: 'Missing required fields. Please ensure all required fields are filled.' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userData.metadata.email_address)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if user already exists by email
    try {
      const existingUser = await cosmic.objects.findOne({
        type: 'user-profiles',
        'metadata.email_address': userData.metadata.email_address
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

    // Set default values and ensure proper structure
    const finalUserData = {
      ...userData,
      metadata: {
        ...userData.metadata,
        profile_complete: userData.metadata.profile_complete || false,
        async_communication: userData.metadata.async_communication || false,
        account_status: userData.metadata.account_status || {
          key: 'ACTIVE',
          value: 'Active'
        }
      }
    }

    console.log('Creating user profile with final data:', {
      title: finalUserData.title,
      slug: finalUserData.slug,
      email: finalUserData.metadata.email_address,
      hasRequiredFields: {
        full_name: !!finalUserData.metadata.full_name,
        email_address: !!finalUserData.metadata.email_address,
        current_role: !!finalUserData.metadata.current_role,
        company: !!finalUserData.metadata.company,
        timezone: !!finalUserData.metadata.timezone?.value,
        seniority_level: !!finalUserData.metadata.seniority_level?.value
      }
    })

    // Create user profile in Cosmic
    const response = await cosmic.objects.insertOne(finalUserData)
    
    console.log('Successfully created profile:', {
      id: response.object?.id,
      slug: response.object?.slug,
      title: response.object?.title
    })

    return NextResponse.json({
      message: 'Profile created successfully',
      profile: {
        id: response.object?.id,
        slug: response.object?.slug,
        title: response.object?.title,
        email: finalUserData.metadata.email_address
      }
    })

  } catch (error: any) {
    console.error('Detailed signup profile error:', {
      message: error.message,
      status: error.status,
      response: error.response?.data,
      stack: error.stack
    })
    
    // Provide more specific error messages
    if (error.status === 400) {
      return NextResponse.json(
        { message: 'Invalid data provided. Please check your form inputs and try again.' },
        { status: 400 }
      )
    } else if (error.status === 401) {
      return NextResponse.json(
        { message: 'Authentication failed. Please contact support.' },
        { status: 401 }
      )
    } else if (error.status === 403) {
      return NextResponse.json(
        { message: 'Permission denied. Please contact support.' },
        { status: 403 }
      )
    } else if (error.status === 404 && error.message?.includes('bucket')) {
      return NextResponse.json(
        { message: 'Configuration error: Cosmic bucket not found. Please contact support.' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { message: `Failed to create profile: ${error.message || 'Unknown error'}` },
      { status: 500 }
    )
  }
}