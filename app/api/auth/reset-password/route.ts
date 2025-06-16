import { NextRequest, NextResponse } from 'next/server'
import { createBucketClient } from '@cosmicjs/sdk'
import { hashPassword } from '@/lib/password-utils'
import { validateEmail } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, newPassword, resetToken } = body
    
    // Validate email
    const emailValidation = validateEmail(email)
    if (!emailValidation.isValid) {
      return NextResponse.json(
        { error: emailValidation.errors[0] },
        { status: 400 }
      )
    }

    // Validate new password
    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // For now, we'll implement a simple reset (in production, implement proper token verification)
    if (!resetToken || resetToken !== 'demo-reset-token') {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Check environment variables
    const bucketSlug = process.env.COSMIC_BUCKET_SLUG
    const readKey = process.env.COSMIC_READ_KEY
    const writeKey = process.env.COSMIC_WRITE_KEY
    
    if (!bucketSlug || !readKey || !writeKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Create Cosmic client
    const cosmic = createBucketClient({
      bucketSlug,
      readKey,
      writeKey,
    })

    // Find user by email
    try {
      const response = await cosmic.objects.find({
        type: 'user-profiles',
        'metadata.email': email.trim().toLowerCase()
      }).props(['id', 'metadata'])

      if (!response.objects || response.objects.length === 0) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      const userObject = response.objects[0]
      
      // Hash new password
      const hashedPassword = await hashPassword(newPassword)
      
      // Update password in Cosmic
      await cosmic.objects.updateOne(userObject.id, {
        metadata: {
          ...userObject.metadata,
          password_hash: hashedPassword
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Password reset successfully'
      })

    } catch (error: any) {
      if (error.status === 404) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }
      throw error
    }
    
  } catch (error: any) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    )
  }
}