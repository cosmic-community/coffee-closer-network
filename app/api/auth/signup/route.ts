import { NextRequest, NextResponse } from 'next/server'
import { signUp } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { fullName, email, password, currentRole, company, seniorityLevel, industryVertical, bio } = body
    
    if (!fullName?.trim()) {
      return NextResponse.json(
        { error: 'Full name is required' },
        { status: 400 }
      )
    }
    
    if (!email?.trim()) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }
    
    if (!password?.trim()) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }
    
    if (!currentRole?.trim()) {
      return NextResponse.json(
        { error: 'Current role is required' },
        { status: 400 }
      )
    }
    
    if (!seniorityLevel?.trim()) {
      return NextResponse.json(
        { error: 'Seniority level is required' },
        { status: 400 }
      )
    }
    
    if (!industryVertical?.trim()) {
      return NextResponse.json(
        { error: 'Industry vertical is required' },
        { status: 400 }
      )
    }

    // Create user
    const user = await signUp({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
      currentRole: currentRole.trim(),
      company: company?.trim() || '',
      seniorityLevel: seniorityLevel.trim(),
      industryVertical: industryVertical.trim(),
      bio: bio?.trim() || ''
    })

    // Return success response without password hash
    const { password_hash, ...safeMetadata } = user.metadata
    
    return NextResponse.json({
      success: true,
      message: 'Account created successfully!',
      user: {
        id: user.id,
        title: user.title,
        slug: user.slug,
        metadata: safeMetadata
      }
    }, { status: 201 })
    
  } catch (error: any) {
    console.error('Signup API detailed error:', {
      message: error.message,
      status: error.status,
      stack: error.stack,
      name: error.name
    })
    
    // Handle specific error types
    if (error.message) {
      if (error.message.includes('already exists')) {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 409 }
        )
      }
      
      if (error.message.includes('required') || 
          error.message.includes('Full name') ||
          error.message.includes('Email') ||
          error.message.includes('Password') ||
          error.message.includes('Current role')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        )
      }
      
      if (error.message.includes('Server configuration')) {
        return NextResponse.json(
          { error: 'Server configuration error. Please contact support.' },
          { status: 500 }
        )
      }
      
      if (error.message.includes('environment variables') || error.message.includes('writeKey')) {
        return NextResponse.json(
          { error: 'Server configuration error. Please contact support.' },
          { status: 500 }
        )
      }
    }
    
    // Handle HTTP status codes
    if (error.status) {
      if (error.status === 400) {
        return NextResponse.json(
          { error: 'Invalid data provided. Please check your information and try again.' },
          { status: 400 }
        )
      }
      
      if (error.status === 403) {
        return NextResponse.json(
          { error: 'Permission denied. Please contact support.' },
          { status: 403 }
        )
      }
      
      if (error.status === 401) {
        return NextResponse.json(
          { error: 'Authentication failed. Please check your credentials.' },
          { status: 401 }
        )
      }
    }
    
    // Generic error response
    return NextResponse.json(
      { error: 'An unexpected error occurred during signup. Please try again.' },
      { status: 500 }
    )
  }
}