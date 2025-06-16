'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/dashboard" className="text-neutral-700 hover:text-coffee-600 transition-colors">
              Dashboard
            </Link>
            <Link href="/signup" className="btn btn-primary">
              Sign Up
            </Link>
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
                <Link href="/dashboard" className="btn btn-secondary">
                  Dashboard
                </Link>
                <Link href="/signup" className="btn btn-primary">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}