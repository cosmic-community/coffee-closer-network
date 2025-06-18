import { NextRequest, NextResponse } from 'next/server'
import { getUserProfiles } from '@/lib/cosmic'
import { getSession } from '@/lib/session'
import type { UserProfile } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const user = await getSession()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = parseInt(searchParams.get('skip') || '0')
    const search = searchParams.get('search') || ''
    const seniorityLevel = searchParams.get('seniority_level') || ''
    const industryVertical = searchParams.get('industry_vertical') || ''
    const salesFocus = searchParams.get('sales_focus') || ''

    // Get all user profiles
    const allProfiles = await getUserProfiles()
    
    // Filter out the current user's profile
    let filteredProfiles = allProfiles.filter((profile: UserProfile) => profile.id !== user.id)
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filteredProfiles = filteredProfiles.filter((profile: UserProfile) => {
        const fullName = profile.metadata?.full_name?.toLowerCase() || ''
        const company = profile.metadata?.company?.toLowerCase() || ''
        const role = profile.metadata?.current_role?.toLowerCase() || ''
        const bio = profile.metadata?.bio?.toLowerCase() || ''
        
        return fullName.includes(searchLower) ||
               company.includes(searchLower) ||
               role.includes(searchLower) ||
               bio.includes(searchLower)
      })
    }
    
    // Apply seniority level filter
    if (seniorityLevel) {
      filteredProfiles = filteredProfiles.filter((profile: UserProfile) => 
        profile.metadata?.seniority_level?.key === seniorityLevel
      )
    }
    
    // Apply industry vertical filter
    if (industryVertical) {
      filteredProfiles = filteredProfiles.filter((profile: UserProfile) => 
        profile.metadata?.industry_vertical?.key === industryVertical
      )
    }
    
    // Apply sales focus filter
    if (salesFocus) {
      filteredProfiles = filteredProfiles.filter((profile: UserProfile) => 
        profile.metadata?.sales_focus?.key === salesFocus
      )
    }

    // Apply pagination
    const total = filteredProfiles.length
    const paginatedProfiles = filteredProfiles.slice(skip, skip + limit)

    return NextResponse.json({
      success: true,
      users: paginatedProfiles,
      total,
      limit,
      skip,
      hasMore: skip + limit < total
    })

  } catch (error: any) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}