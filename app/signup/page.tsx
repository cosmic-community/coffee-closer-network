'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ProfileSignupForm from '@/components/ProfileSignupForm'

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-neutral-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-coffee-600 rounded-lg flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-3xl">☕</span>
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">
              Join Coffee Closer Network
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Connect with sales professionals for meaningful 15-minute conversations that help you build stronger networks and accelerate your career.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <ProfileSignupForm />
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-600">
              Already have an account?{' '}
              <Link href="/login" className="text-coffee-600 hover:text-coffee-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}