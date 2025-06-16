'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  fullName: string
  isAdmin?: boolean
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          credentials: 'include'
        })
        
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      setUser(null)
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-coffee-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">☕</span>
            </div>
            <span className="font-bold text-xl text-neutral-900">Coffee Closer</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-neutral-700 hover:text-coffee-600 transition-colors">
              Home
            </Link>
            <Link href="/blog" className="text-neutral-700 hover:text-coffee-600 transition-colors">
              Blog
            </Link>
            <Link href="/directory" className="text-neutral-700 hover:text-coffee-600 transition-colors">
              Directory
            </Link>
            <Link href="/faq" className="text-neutral-700 hover:text-coffee-600 transition-colors">
              FAQ
            </Link>
            <Link href="/about" className="text-neutral-700 hover:text-coffee-600 transition-colors">
              About
            </Link>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {isLoading ? (
              <div className="w-6 h-6 animate-spin rounded-full border-b-2 border-coffee-600"></div>
            ) : user ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="text-neutral-700 hover:text-coffee-600 transition-colors">
                  Dashboard
                </Link>
                <Link href="/profile" className="text-neutral-700 hover:text-coffee-600 transition-colors">
                  Profile
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-600">
                    {user.fullName.split(' ')[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-neutral-700 hover:text-coffee-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-neutral-700 hover:text-coffee-600 transition-colors">
                  Login
                </Link>
                <Link href="/signup" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block w-5 h-0.5 bg-neutral-600 transition-all ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-neutral-600 my-1 transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-neutral-600 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 py-4">
            <div className="flex flex-col gap-4">
              <Link href="/" className="text-neutral-700 hover:text-coffee-600 transition-colors py-2">
                Home
              </Link>
              <Link href="/blog" className="text-neutral-700 hover:text-coffee-600 transition-colors py-2">
                Blog
              </Link>
              <Link href="/directory" className="text-neutral-700 hover:text-coffee-600 transition-colors py-2">
                Directory
              </Link>
              <Link href="/faq" className="text-neutral-700 hover:text-coffee-600 transition-colors py-2">
                FAQ
              </Link>
              <Link href="/about" className="text-neutral-700 hover:text-coffee-600 transition-colors py-2">
                About
              </Link>
              
              <div className="flex flex-col gap-2 pt-4 border-t border-neutral-200">
                {user ? (
                  <>
                    <Link href="/dashboard" className="btn btn-secondary">
                      Dashboard
                    </Link>
                    <Link href="/profile" className="btn btn-secondary">
                      Profile
                    </Link>
                    <button onClick={handleLogout} className="btn btn-secondary text-left">
                      Logout ({user.fullName})
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="btn btn-secondary">
                      Login
                    </Link>
                    <Link href="/signup" className="btn btn-primary">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}