import { NextRequest, NextResponse } from 'next/server'
import { cosmic } from '@/lib/cosmic'

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()
    
    console.log('Received signup data:', {
      title: userData.title,
      type: userData.type,
      slug: userData.slug,
      hasMetadata: !!userData.metadata
    })

    // Validate required fields
    if (!userData.title || !userData.metadata) {
      console.error('Missing required fields:', { 
        hasTitle: !!userData.title, 
        hasMetadata: !!userData.metadata 
      })
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already exists by email or slug
    try {
      let existingUser = null
      
      // Check by email if provided
      if (userData.metadata.email) {
        try {
          const emailCheck = await cosmic.objects.findOne({
            type: 'user-profiles',
            'metadata.email': userData.metadata.email
          })
          if (emailCheck) {
            existingUser = emailCheck
          }
        } catch (emailError: any) {
          if (emailError?.status !== 404) {
            throw emailError
          }
        }
      }
      
      // Check by slug if not found by email
      if (!existingUser) {
        try {
          const slugCheck = await cosmic.objects.findOne({
            type: 'user-profiles',
            slug: userData.slug
          })
          if (slugCheck) {
            existingUser = slugCheck
          }
        } catch (slugError: any) {
          if (slugError?.status !== 404) {
            throw slugError
          }
        }
      }
      
      if (existingUser) {
        console.log('User already exists:', { slug: userData.slug, email: userData.metadata.email })
        return NextResponse.json(
          { message: 'A user with this email or name already exists' },
          { status: 409 }
        )
      }
    } catch (error: any) {
      console.error('Error checking for existing user:', error)
      throw error
    }

    // Log the data being sent to Cosmic
    console.log('Creating user profile with data:', JSON.stringify(userData, null, 2))

    // Create user profile in Cosmic
    const response = await cosmic.objects.insertOne(userData)
    
    console.log('Successfully created profile:', {
      id: response.object?.id,
      slug: response.object?.slug,
      title: response.object?.title
    })

    return NextResponse.json({
      message: 'Profile created successfully',
      profile: response.object
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
      { message: `Failed to create profile: ${error.message || 'Unknown error'}` },
      { status: 500 }
    )
  }
}