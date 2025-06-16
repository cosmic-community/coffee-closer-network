import { NextRequest, NextResponse } from 'next/server'
import { cosmic } from '@/lib/cosmic'

export async function POST(request: NextRequest) {
  try {
    const { fullName } = await request.json()

    if (!fullName) {
      return NextResponse.json(
        { message: 'Full name is required' },
        { status: 400 }
      )
    }

    // Generate slug from full name
    const slug = fullName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

    try {
      // Check if user exists by slug
      await cosmic.objects.findOne({
        type: 'user-profiles',
        slug
      })
      
      // If we get here, user exists
      return NextResponse.json({ exists: true })
      
    } catch (error) {
      // If 404, user doesn't exist
      if ((error as any)?.status === 404) {
        return NextResponse.json({ exists: false })
      }
      
      // Other errors should be thrown
      throw error
    }

  } catch (error) {
    console.error('Check duplicate error:', error)
    return NextResponse.json(
      { message: 'Failed to check for duplicate' },
      { status: 500 }
    )
  }
}