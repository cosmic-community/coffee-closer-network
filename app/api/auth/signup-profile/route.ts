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

    // Check if user already exists
    try {
      const existingUser = await cosmic.objects.findOne({
        type: 'user-profiles',
        slug: userData.slug
      })
      
      if (existingUser) {
        console.log('User already exists with slug:', userData.slug)
        return NextResponse.json(
          { message: 'A user with this name already exists' },
          { status: 409 }
        )
      }
    } catch (error: any) {
      // If 404, user doesn't exist - continue with creation
      if (error?.status !== 404) {
        console.error('Error checking for existing user:', error)
        throw error
      }
      console.log('No existing user found, proceeding with creation')
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
    }
    
    return NextResponse.json(
      { message: `Failed to create profile: ${error.message || 'Unknown error'}` },
      { status: 500 }
    )
  }
}