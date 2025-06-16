import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJWT } from './lib/jwt-utils'

const protectedRoutes = ['/dashboard', '/profile', '/match']
const authRoutes = ['/login', '/signup']

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  const isAuthRoute = authRoutes.includes(path)
  
  const token = request.cookies.get('auth-token')?.value
  const user = token ? await verifyJWT(token) : null

  // Redirect to login if accessing protected route without valid session
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }

  // Redirect to dashboard if accessing auth routes with valid session
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}