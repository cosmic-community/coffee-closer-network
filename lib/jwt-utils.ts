import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'coffee-closer-network-secret-key-development-only'
)

export interface JWTPayload {
  userId: string
  email: string
  fullName: string
  isAdmin?: boolean
  iat?: number
  exp?: number
}

export async function signJWT(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d') // 7 days
      .sign(secret)
    
    return token
  } catch (error) {
    console.error('JWT signing error:', error)
    throw new Error('Failed to create session token')
  }
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as JWTPayload
  } catch (error) {
    console.error('JWT verification error:', error)
    return null
  }
}

export function getTokenExpirationTime(): Date {
  const now = new Date()
  const expirationTime = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days
  return expirationTime
}