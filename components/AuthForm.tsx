'use client'

import { useState } from 'react'
import Link from 'next/link'

interface AuthFormProps {
  mode: 'signin' | 'signup'
  onSubmit: (data: any) => Promise<void>
  isLoading: boolean
  error: string | null
}

export default function AuthForm({ mode, onSubmit, isLoading, error }: AuthFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    currentRole: '',
    company: '',
    seniorityLevel: '',
    industryVertical: '',
    bio: '',
    confirmPassword: '',
    terms: false
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (mode === 'signup') {
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match')
      }
      if (!formData.terms) {
        throw new Error('Please accept the terms and conditions')
      }
    }
    
    await onSubmit(formData)
  }

  const isSignUp = mode === 'signup'

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-coffee-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-2xl">☕</span>
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">
          {isSignUp ? 'Join Coffee Closer Network' : 'Welcome Back'}
        </h1>
        <p className="text-neutral-600">
          {isSignUp 
            ? 'Connect with sales professionals for meaningful conversations'
            : 'Sign in to your Coffee Closer Network account'
          }
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {isSignUp && (
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-neutral-700 mb-2">
              Full Name *
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
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
            Email Address *
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
            Password *
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
            placeholder={isSignUp ? "Create a password (8+ characters)" : "Enter your password"}
            minLength={isSignUp ? 8 : undefined}
          />
          {isSignUp && (
            <p className="text-sm text-neutral-500 mt-1">Must be at least 8 characters</p>
          )}
        </div>

        {isSignUp && (
          <>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-2">
                Confirm Password *
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
                Current Role *
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
                Company *
              </label>
              <input
                type="text"
                id="company"
                name="company"
                required
                value={formData.company}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                placeholder="Enter your company name"
              />
            </div>

            <div>
              <label htmlFor="seniorityLevel" className="block text-sm font-medium text-neutral-700 mb-2">
                Seniority Level *
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
                <option value="AE">Account Executive</option>
                <option value="SR_AE">Senior Account Executive</option>
                <option value="MANAGER">Sales Manager</option>
                <option value="VP">VP of Sales</option>
              </select>
            </div>

            <div>
              <label htmlFor="industryVertical" className="block text-sm font-medium text-neutral-700 mb-2">
                Industry Vertical *
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
                Bio / Introduction *
              </label>
              <textarea
                id="bio"
                name="bio"
                required
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
                </Link> *
              </label>
            </div>
          </>
        )}

        {!isSignUp && (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-neutral-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-700">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <Link href="/forgot-password" className="text-coffee-600 hover:text-coffee-700">
                Forgot your password?
              </Link>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading 
            ? (isSignUp ? 'Creating Account...' : 'Signing in...') 
            : (isSignUp ? 'Create Account' : 'Sign In')
          }
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-neutral-600">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <Link 
            href={isSignUp ? '/login' : '/signup'} 
            className="text-coffee-600 hover:text-coffee-700 font-medium"
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </Link>
        </p>
      </div>
    </div>
  )
}