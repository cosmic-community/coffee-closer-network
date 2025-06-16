import { NextRequest, NextResponse } from 'next/server'
import { UserStorage } from '@/lib/user-storage'

export async function POST(request: NextRequest) {
  try {
    console.log('Signup API called')
    
    const body = await request.json()
    console.log('Request body received:', { ...body, password: '[REDACTED]' })
    
    // Validate required fields
    const { fullName, email, password, currentRole, company, seniorityLevel, industryVertical, bio } = body
    
    const errors: string[] = []
    
    if (!fullName?.trim()) errors.push('Full name is required')
    if (!email?.trim()) errors.push('Email is required')
    if (!password?.trim()) errors.push('Password is required')
    if (!currentRole?.trim()) errors.push('Current role is required')
    if (!seniorityLevel?.trim()) errors.push('Seniority level is required')
    if (!industryVertical?.trim()) errors.push('Industry vertical is required')
    
    if (errors.length > 0) {
      console.log('Validation errors:', errors)
      return NextResponse.json(
        { error: errors.join(', ') },
        { status: 400 }
      )
    }
    
    try {
      // Create new user using shared storage
      const newUser = UserStorage.createUser({
        fullName,
        email,
        password,
        currentRole,
        company,
        seniorityLevel,
        industryVertical,
        bio
      })
      
      console.log('User created successfully:', newUser.id)
      console.log('Total users now:', UserStorage.getUserCount())
      
      // Return success response (without password)
      const { password: _, ...safeUser } = newUser
      
      return NextResponse.json({
        success: true,
        message: 'Account created successfully! You can now log in.',
        user: safeUser
      }, { status: 201 })
      
    } catch (createError: any) {
      if (createError.message === 'An account with this email already exists') {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 409 }
        )
      }
      throw createError
    }
    
  } catch (error: any) {
    console.error('Signup API error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    
    return NextResponse.json(
      { error: 'An unexpected error occurred during signup. Please try again.' },
      { status: 500 }
    )
  }
}

// GET method to retrieve users (for debugging)
export async function GET() {
  try {
    const users = UserStorage.getAllUsers()
    return NextResponse.json({ 
      users,
      count: users.length,
      message: 'Users retrieved successfully'
    })
  } catch (error: any) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve users' },
      { status: 500 }
    )
  }
}