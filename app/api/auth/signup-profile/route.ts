import { NextRequest, NextResponse } from 'next/server'
import { cosmic } from '@/lib/cosmic'

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    // Validate required fields
    if (!userData.title || !userData.metadata) {
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
        return NextResponse.json(
          { message: 'A user with this name already exists' },
          { status: 409 }
        )
      }
    } catch (error) {
      // If 404, user doesn't exist - continue with creation
      if ((error as any)?.status !== 404) {
        throw error
      }
    }

    // Create user profile in Cosmic
    const response = await cosmic.objects.insertOne(userData)

    return NextResponse.json({
      message: 'Profile created successfully',
      profile: response.object
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { message: 'Failed to create profile' },
      { status: 500 }
    )
  }
}