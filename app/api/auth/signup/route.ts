import { NextRequest, NextResponse } from 'next/server'
import { cosmic } from '@/lib/cosmic'
import bcrypt from 'bcryptjs'

interface SignupData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  currentRole: string
  company: string
  seniorityLevel: string
  industryVertical: string
  bio: string
  terms: boolean
}

export async function POST(request: NextRequest) {
  try {
    const signupData: SignupData = await request.json()
    
    console.log('Received signup data:', {
      email: signupData.email,
      fullName: signupData.fullName,
      company: signupData.company,
      currentRole: signupData.currentRole,
      bucketSlug: process.env.COSMIC_BUCKET_SLUG
    })

    // Validate that we're using the correct bucket
    if (process.env.COSMIC_BUCKET_SLUG !== 'coffee-closers-production') {
      console.error('Incorrect bucket slug configured:', process.env.COSMIC_BUCKET_SLUG)
      return NextResponse.json(
        { message: 'Server configuration error. Please contact support.' },
        { status: 500 }
      )
    }

    // Validate required fields with proper error messages
    const requiredFieldChecks = [
      { field: signupData.fullName, name: 'Full name' },
      { field: signupData.email, name: 'Email address' },
      { field: signupData.password, name: 'Password' },
      { field: signupData.confirmPassword, name: 'Password confirmation' },
      { field: signupData.currentRole, name: 'Current role' },
      { field: signupData.company, name: 'Company' },
      { field: signupData.seniorityLevel, name: 'Seniority level' },
      { field: signupData.industryVertical, name: 'Industry vertical' }
    ]

    const missingFields: string[] = []
    for (const check of requiredFieldChecks) {
      if (!check.field || (typeof check.field === 'string' && check.field.trim().length === 0)) {
        missingFields.push(check.name)
      }
    }

    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(signupData.email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password match
    if (signupData.password !== signupData.confirmPassword) {
      return NextResponse.json(
        { message: 'Passwords do not match' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (signupData.password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Validate terms acceptance
    if (!signupData.terms) {
      return NextResponse.json(
        { message: 'You must accept the terms and conditions' },
        { status: 400 }
      )
    }

    // Check if user already exists
    try {
      const existingUser = await cosmic.objects.find({
        type: 'user-profiles',
        'metadata.email_address': signupData.email
      })
      
      if (existingUser.objects && existingUser.objects.length > 0) {
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

    // Hash password
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(signupData.password, saltRounds)

    // Generate slug from full name
    const slug = signupData.fullName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

    // Map seniority level to proper format
    const seniorityMapping: Record<string, { key: string; value: string }> = {
      'SDR': { key: 'SDR', value: 'SDR (Sales Development Rep)' },
      'AE': { key: 'AE', value: 'Account Executive' },
      'SR_AE': { key: 'SR_AE', value: 'Senior Account Executive' },
      'MANAGER': { key: 'MANAGER', value: 'Sales Manager' },
      'VP': { key: 'VP', value: 'VP of Sales' }
    }

    // Map industry vertical to proper format
    const industryMapping: Record<string, { key: string; value: string }> = {
      'SAAS': { key: 'SAAS', value: 'SaaS' },
      'FINTECH': { key: 'FINTECH', value: 'Fintech' },
      'HEALTHCARE': { key: 'HEALTHCARE', value: 'Healthcare' },
      'EDTECH': { key: 'EDTECH', value: 'EdTech' },
      'ECOMMERCE': { key: 'ECOMMERCE', value: 'E-commerce' },
      'MARTECH': { key: 'MARTECH', value: 'MarTech' },
      'CYBERSECURITY': { key: 'CYBERSECURITY', value: 'Cybersecurity' },
      'OTHER': { key: 'OTHER', value: 'Other' }
    }

    // Create user profile in Cosmic with properly mapped fields
    const userData = {
      title: signupData.fullName,
      type: 'user-profiles',
      status: 'published',
      slug: slug,
      metadata: {
        full_name: signupData.fullName,
        email_address: signupData.email,
        password_hash: passwordHash,
        current_role: signupData.currentRole,
        company: signupData.company,
        seniority_level: seniorityMapping[signupData.seniorityLevel] || {
          key: 'OTHER',
          value: signupData.seniorityLevel
        },
        industry_vertical: industryMapping[signupData.industryVertical] || {
          key: 'OTHER', 
          value: signupData.industryVertical
        },
        bio: signupData.bio || '',
        profile_complete: false,
        account_status: {
          key: 'ACTIVE',
          value: 'Active'
        }
      }
    }

    console.log('Creating user profile in coffee-closers-production bucket:', { 
      email: signupData.email, 
      slug,
      bucketSlug: process.env.COSMIC_BUCKET_SLUG
    })

    const response = await cosmic.objects.insertOne(userData)
    
    console.log('Successfully created profile:', {
      id: response.object?.id,
      slug: response.object?.slug,
      email: signupData.email,
      bucketSlug: process.env.COSMIC_BUCKET_SLUG
    })

    // Return success without sensitive data
    return NextResponse.json({
      message: 'Account created successfully',
      user: {
        id: response.object?.id,
        slug: response.object?.slug,
        fullName: signupData.fullName,
        email: signupData.email,
        needsProfileSetup: false
      }
    })

  } catch (error: any) {
    console.error('Detailed signup error:', {
      message: error.message,
      status: error.status,
      response: error.response?.data,
      stack: error.stack,
      bucketSlug: process.env.COSMIC_BUCKET_SLUG
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
        { message: 'Configuration error: Cosmic bucket "coffee-closers-production" not found. Please check your COSMIC_BUCKET_SLUG environment variable.' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { message: `Failed to create account: ${error.message || 'Unknown error'}` },
      { status: 500 }
    )
  }
}