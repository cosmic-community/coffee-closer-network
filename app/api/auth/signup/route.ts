import { NextRequest, NextResponse } from 'next/server'
import { signUp } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { fullName, email, password, currentRole, company, seniorityLevel, industryVertical, bio } = body
    
    if (!fullName || !email || !password || !currentRole || !seniorityLevel || !industryVertical) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create user
    const user = await signUp({
      fullName,
      email,
      password,
      currentRole,
      company: company || '',
      seniorityLevel,
      industryVertical,
      bio: bio || ''
    })

    // Return user data (without password hash)
    const { password_hash, ...userMetadata } = user.metadata
    
    return NextResponse.json({
      success: true,
      user: {
        ...user,
        metadata: userMetadata
      }
    })
  } catch (error) {
    console.error('Signup API error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'An error occurred during signup'
    const statusCode = errorMessage.includes('already exists') ? 409 : 
                      errorMessage.includes('required') ? 400 : 500
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    )
  }
}