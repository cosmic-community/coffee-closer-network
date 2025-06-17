import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { updateUserProfile } from '@/lib/cosmic-profile'
import { validateProfileData } from '@/lib/form-schemas'

export async function PUT(request: NextRequest) {
  try {
    const user = await getSession()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const profileData = await request.json()
    
    // Validate the profile data
    const validation = validateProfileData(profileData)
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Invalid profile data', details: validation.errors },
        { status: 400 }
      )
    }

    // Update the profile in Cosmic
    const updatedProfile = await updateUserProfile(user.id, profileData)
    
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      profile: updatedProfile
    })

  } catch (error: any) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update profile' },
      { status: 500 }
    )
  }
}