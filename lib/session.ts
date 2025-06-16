import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { signJWT, verifyJWT, JWTPayload } from './jwt-utils'

export interface SessionUser {
  id: string
  email: string
  fullName: string
  isAdmin?: boolean
}

const COOKIE_NAME = 'auth-token'
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/'
}

export async function createSession(user: SessionUser): Promise<string> {
  try {
    const token = await signJWT({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      isAdmin: user.isAdmin || false
    })
    
    return token
  } catch (error) {
    console.error('Session creation error:', error)
    throw new Error('Failed to create session')
  }
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value

    if (!token) {
      return null
    }

    const payload = await verifyJWT(token)
    
    if (!payload) {
      return null
    }

    return {
      id: payload.userId,
      email: payload.email,
      fullName: payload.fullName,
      isAdmin: payload.isAdmin || false
    }
  } catch (error) {
    console.error('Session retrieval error:', error)
    return null
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  try {
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, token, COOKIE_OPTIONS)
  } catch (error) {
    console.error('Cookie setting error:', error)
    throw new Error('Failed to set session cookie')
  }
}

export async function deleteSession(): Promise<void> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_NAME)
  } catch (error) {
    console.error('Session deletion error:', error)
    throw new Error('Failed to delete session')
  }
}

export function getSessionFromRequest(request: NextRequest): string | null {
  return request.cookies.get(COOKIE_NAME)?.value || null
}

export async function verifySessionFromRequest(request: NextRequest): Promise<SessionUser | null> {
  const token = getSessionFromRequest(request)
  
  if (!token) {
    return null
  }

  const payload = await verifyJWT(token)
  
  if (!payload) {
    return null
  }

  return {
    id: payload.userId,
    email: payload.email,
    fullName: payload.fullName,
    isAdmin: payload.isAdmin || false
  }
}

export function createSessionResponse(data: any, token: string): NextResponse {
  const response = NextResponse.json(data)
  response.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS)
  return response
}

export function createLogoutResponse(): NextResponse {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' })
  response.cookies.delete(COOKIE_NAME)
  return response
}