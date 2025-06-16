import { NextResponse } from 'next/server'
import { createLogoutResponse } from '@/lib/session'

export async function POST() {
  try {
    return createLogoutResponse()
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    )
  }
}