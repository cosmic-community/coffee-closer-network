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

  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }))

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const errors: {[key: string]: string} = {}

    if (isSignUp) {
      if (!formData.fullName.trim()) {
        errors.fullName = 'Full name is required'
      }
      if (!formData.currentRole.trim()) {
        errors.currentRole = 'Current role is required'
      }
      if (!formData.company.trim()) {
        errors.company = 'Company is required'
      }
      if (!formData.seniorityLevel) {
        errors.seniorityLevel = 'Seniority level is required'
      }
      if (!formData.industryVertical) {
        errors.industryVertical = 'Industry vertical is required'
      }
      if (!formData.bio.trim()) {
        errors.bio = 'Bio is required'
      } else if (formData.bio.length > 500) {
        errors.bio = 'Bio must be 500 characters or less'
      }
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password'
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match'
      }
      if (!formData.terms) {
        errors.terms = 'You must accept the terms and conditions'
      }
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
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
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent ${
                formErrors.fullName ? 'border-red-500' : 'border-neutral-300'
              }`}
              placeholder="Enter your full name"
            />
            {formErrors.fullName && (
              <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>
            )}
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
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent ${
              formErrors.email ? 'border-red-500' : 'border-neutral-300'
            }`}
            placeholder="Enter your email address"
          />
          {formErrors.email && (
            <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
          )}
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
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent ${
              formErrors.password ? 'border-red-500' : 'border-neutral-300'
            }`}
            placeholder={isSignUp ? "Create a password (8+ characters)" : "Enter your password"}
            minLength={8}
          />
          {formErrors.password && (
            <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
          )}
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
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent ${
                  formErrors.confirmPassword ? 'border-red-500' : 'border-neutral-300'
                }`}
                placeholder="Confirm your password"
                minLength={8}
              />
              {formErrors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</p>
              )}
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
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent ${
                  formErrors.currentRole ? 'border-red-500' : 'border-neutral-300'
                }`}
                placeholder="e.g., Account Executive, SDR, Sales Manager"
              />
              {formErrors.currentRole && (
                <p className="text-red-500 text-sm mt-1">{formErrors.currentRole}</p>
              )}
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
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent ${
                  formErrors.company ? 'border-red-500' : 'border-neutral-300'
                }`}
                placeholder="Enter your company name"
              />
              {formErrors.company && (
                <p className="text-red-500 text-sm mt-1">{formErrors.company}</p>
              )}
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
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent ${
                  formErrors.seniorityLevel ? 'border-red-500' : 'border-neutral-300'
                }`}
              >
                <option value="">Select your seniority level</option>
                <option value="SDR">SDR (Sales Development Rep)</option>
                <option value="AE">Account Executive</option>
                <option value="SR_AE">Senior Account Executive</option>
                <option value="MANAGER">Sales Manager</option>
                <option value="VP">VP of Sales</option>
                <option value="OTHER">Other</option>
              </select>
              {formErrors.seniorityLevel && (
                <p className="text-red-500 text-sm mt-1">{formErrors.seniorityLevel}</p>
              )}
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
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent ${
                  formErrors.industryVertical ? 'border-red-500' : 'border-neutral-300'
                }`}
              >
                <option value="">Select your industry</option>
                <option value="SAAS">SaaS</option>
                <option value="FINTECH">Fintech</option>
                <option value="HEALTHCARE">Healthcare</option>
                <option value="MANUFACTURING">Manufacturing</option>
                <option value="RETAIL">Retail</option>
                <option value="REAL_ESTATE">Real Estate</option>
                <option value="TECHNOLOGY">Technology</option>
                <option value="OTHER">Other</option>
              </select>
              {formErrors.industryVertical && (
                <p className="text-red-500 text-sm mt-1">{formErrors.industryVertical}</p>
              )}
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
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent ${
                  formErrors.bio ? 'border-red-500' : 'border-neutral-300'
                }`}
                placeholder="Tell us about yourself and what you'd like to discuss..."
                maxLength={500}
              />
              {formErrors.bio && (
                <p className="text-red-500 text-sm mt-1">{formErrors.bio}</p>
              )}
              <p className="text-sm text-neutral-500 mt-1">{formData.bio.length}/500 characters</p>
            </div>

            <div>
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
              {formErrors.terms && (
                <p className="text-red-500 text-sm mt-1">{formErrors.terms}</p>
              )}
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
          className="w-full bg-coffee-600 text-white py-2 px-4 rounded-md hover:bg-coffee-700 focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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