'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    currentRole: '',
    company: '',
    seniorityLevel: '',
    industryVertical: '',
    bio: '',
    terms: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      setIsLoading(false)
      return
    }

    if (!formData.terms) {
      setError('Please accept the terms and conditions')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          currentRole: formData.currentRole,
          company: formData.company,
          seniorityLevel: formData.seniorityLevel,
          industryVertical: formData.industryVertical,
          bio: formData.bio
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'An error occurred during signup')
      }

      setSuccess(true)
      
      // Redirect to dashboard after successful signup
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during signup')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-neutral-50 py-16">
        <div className="container-custom">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">✓</span>
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">
              Welcome to Coffee Closer Network!
            </h1>
            <p className="text-neutral-600 mb-4">
              Your account has been created successfully. You'll be redirected to your dashboard shortly.
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coffee-600 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-16">
      <div className="container-custom">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-coffee-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">☕</span>
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">
              Join Coffee Closer Network
            </h1>
            <p className="text-neutral-600">
              Connect with sales professionals for meaningful conversations
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-neutral-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                placeholder="Create a password"
                minLength={8}
              />
              <p className="text-sm text-neutral-500 mt-1">Must be at least 8 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                placeholder="Confirm your password"
                minLength={8}
              />
            </div>

            <div>
              <label htmlFor="currentRole" className="block text-sm font-medium text-neutral-700 mb-2">
                Current Role
              </label>
              <input
                type="text"
                id="currentRole"
                name="currentRole"
                required
                value={formData.currentRole}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                placeholder="e.g., Account Executive, SDR, Sales Manager"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-neutral-700 mb-2">
                Company
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                placeholder="Enter your company name"
              />
            </div>

            <div>
              <label htmlFor="seniorityLevel" className="block text-sm font-medium text-neutral-700 mb-2">
                Seniority Level
              </label>
              <select
                id="seniorityLevel"
                name="seniorityLevel"
                required
                value={formData.seniorityLevel}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
              >
                <option value="">Select your seniority level</option>
                <option value="SDR">SDR (Sales Development Rep)</option>
                <option value="BDR">BDR (Business Development Rep)</option>
                <option value="AE">AE (Account Executive)</option>
                <option value="SR_AE">Senior Account Executive</option>
                <option value="AM">Account Manager</option>
                <option value="CSM">Customer Success Manager</option>
                <option value="MANAGER">Sales Manager</option>
                <option value="DIRECTOR">Sales Director</option>
                <option value="VP">VP of Sales</option>
              </select>
            </div>

            <div>
              <label htmlFor="industryVertical" className="block text-sm font-medium text-neutral-700 mb-2">
                Industry Vertical
              </label>
              <select
                id="industryVertical"
                name="industryVertical"
                required
                value={formData.industryVertical}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
              >
                <option value="">Select your industry</option>
                <option value="SAAS">SaaS</option>
                <option value="FINTECH">Fintech</option>
                <option value="HEALTHCARE">Healthcare</option>
                <option value="EDTECH">EdTech</option>
                <option value="ECOMMERCE">E-commerce</option>
                <option value="MARTECH">MarTech</option>
                <option value="CYBERSECURITY">Cybersecurity</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-neutral-700 mb-2">
                Bio / Introduction
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                placeholder="Tell us about yourself and what you'd like to discuss..."
                maxLength={500}
              />
              <p className="text-sm text-neutral-500 mt-1">Max 500 characters</p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                required
                checked={formData.terms}
                onChange={handleChange}
                className="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-neutral-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-neutral-700">
                I agree to the{' '}
                <Link href="/terms" className="text-coffee-600 hover:text-coffee-700">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-coffee-600 hover:text-coffee-700">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600">
              Already have an account?{' '}
              <Link href="/login" className="text-coffee-600 hover:text-coffee-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}