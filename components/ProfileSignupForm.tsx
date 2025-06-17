'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { validateSignupForm, type FormErrors } from '@/lib/form-validation'
import { uploadFile } from '@/lib/file-upload'

interface FormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  currentRole: string
  company: string
  linkedinUrl: string
  profilePicture: File | null
  bio: string
  funFact: string
  timezone: string
  seniorityLevel: string
  salesFocus: string
  industryVertical: string
  preferredChatTimes: string[]
  topicsToDiscuss: string[]
  asyncCommunication: boolean
  terms: boolean
}

const INITIAL_FORM_DATA: FormData = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  currentRole: '',
  company: '',
  linkedinUrl: '',
  profilePicture: null,
  bio: '',
  funFact: '',
  timezone: '',
  seniorityLevel: '',
  salesFocus: '',
  industryVertical: '',
  preferredChatTimes: [],
  topicsToDiscuss: [],
  asyncCommunication: false,
  terms: false
}

const TIMEZONE_OPTIONS = [
  { key: 'EST', value: 'Eastern Time (EST/EDT)' },
  { key: 'CST', value: 'Central Time (CST/CDT)' },
  { key: 'MST', value: 'Mountain Time (MST/MDT)' },
  { key: 'PST', value: 'Pacific Time (PST/PDT)' },
  { key: 'OTHER', value: 'Other' }
]

const SENIORITY_OPTIONS = [
  { key: 'SDR', value: 'SDR (Sales Development Rep)' },
  { key: 'AE', value: 'Account Executive' },
  { key: 'SR_AE', value: 'Senior Account Executive' },
  { key: 'MANAGER', value: 'Sales Manager' },
  { key: 'VP', value: 'VP of Sales' },
  { key: 'OTHER', value: 'Other' }
]

const SALES_FOCUS_OPTIONS = [
  { key: 'OUTBOUND', value: 'Outbound Sales' },
  { key: 'INBOUND', value: 'Inbound Sales' },
  { key: 'SMB', value: 'SMB' },
  { key: 'MID_MARKET', value: 'Mid-Market' },
  { key: 'ENTERPRISE', value: 'Enterprise' },
  { key: 'CHANNEL', value: 'Channel Sales' },
  { key: 'OTHER', value: 'Other' }
]

const INDUSTRY_OPTIONS = [
  { key: 'SAAS', value: 'SaaS' },
  { key: 'FINTECH', value: 'Fintech' },
  { key: 'HEALTHCARE', value: 'Healthcare' },
  { key: 'MANUFACTURING', value: 'Manufacturing' },
  { key: 'RETAIL', value: 'Retail' },
  { key: 'REAL_ESTATE', value: 'Real Estate' },
  { key: 'TECHNOLOGY', value: 'Technology' },
  { key: 'OTHER', value: 'Other' }
]

const CHAT_TIME_OPTIONS = [
  'Early Morning (7-9 AM)',
  'Mid Morning (9-11 AM)',
  'Lunch Time (12-1 PM)',
  'Early Afternoon (1-3 PM)',
  'Late Afternoon (3-5 PM)',
  'Evening (5-7 PM)'
]

const TOPIC_OPTIONS = [
  'Deal Closing',
  'Career Development',
  'Sales Tools & Tech',
  'Prospecting Strategies',
  'Team Management',
  'Cold Calling',
  'Email Outreach',
  'CRM Management',
  'Pipeline Management',
  'Negotiation',
  'Customer Success'
]

export default function ProfileSignupForm() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const router = useRouter()

  const totalSteps = 5

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({ ...prev, profilePicture: file }))
    
    if (errors.profilePicture) {
      setErrors(prev => ({ ...prev, profilePicture: undefined }))
    }
  }

  const handleMultiSelectChange = (field: 'preferredChatTimes' | 'topicsToDiscuss', value: string) => {
    setFormData(prev => {
      const currentValues = prev[field]
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value]
      
      return { ...prev, [field]: newValues }
    })
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateCurrentStep = () => {
    console.log('Validating step', currentStep, 'with data:', formData)
    const stepValidation = validateSignupForm(formData, currentStep)
    console.log('Validation result:', stepValidation)
    setErrors(stepValidation)
    return Object.keys(stepValidation).length === 0
  }

  const handleNext = () => {
    console.log('Attempting to proceed to next step from step', currentStep)
    if (validateCurrentStep()) {
      console.log('Validation passed, moving to next step')
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    } else {
      console.log('Validation failed, staying on current step')
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }

  const checkForDuplicate = async (email: string, fullName: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/check-duplicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, fullName })
      })
      
      if (!response.ok) {
        throw new Error('Failed to check for duplicates')
      }
      
      const { exists } = await response.json()
      return exists
    } catch (error) {
      console.error('Error checking for duplicate:', error)
      return false
    }
  }

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      return
    }

    setIsLoading(true)
    setSubmitError(null)

    try {
      console.log('Starting form submission with data:', {
        fullName: formData.fullName,
        email: formData.email,
        company: formData.company,
        currentRole: formData.currentRole
      })

      // Check for duplicate user
      const isDuplicate = await checkForDuplicate(formData.email, formData.fullName)
      if (isDuplicate) {
        setSubmitError('A user with this email or name already exists. Please use a different email or name.')
        setIsLoading(false)
        return
      }

      // Upload profile picture if provided
      let uploadedImage = null
      if (formData.profilePicture) {
        try {
          console.log('Uploading profile picture...')
          uploadedImage = await uploadFile(formData.profilePicture)
          console.log('Profile picture uploaded successfully:', uploadedImage)
        } catch (uploadError) {
          console.error('Failed to upload profile picture:', uploadError)
          // Continue without profile picture rather than failing completely
        }
      }

      // Generate slug from full name
      const slug = generateSlug(formData.fullName)
      
      // Hash password for storage (this should ideally be done server-side)
      const bcrypt = await import('bcryptjs')
      const passwordHash = await bcrypt.hash(formData.password, 12)

      // Prepare user data for Cosmic using the correct field names from content model
      const userData = {
        title: formData.fullName,
        type: 'user-profiles',
        status: 'published',
        slug: slug,
        metadata: {
          full_name: formData.fullName,
          email_address: formData.email, // Using email_address as per content model
          password_hash: passwordHash,
          current_role: formData.currentRole,
          company: formData.company,
          linkedin_url: formData.linkedinUrl || '',
          bio: formData.bio,
          fun_fact: formData.funFact || '',
          profile_picture: uploadedImage,
          timezone: {
            key: TIMEZONE_OPTIONS.find(tz => tz.value === formData.timezone)?.key || 'OTHER',
            value: formData.timezone
          },
          seniority_level: {
            key: SENIORITY_OPTIONS.find(sl => sl.value === formData.seniorityLevel)?.key || 'OTHER',
            value: formData.seniorityLevel
          },
          sales_focus: formData.salesFocus ? {
            key: SALES_FOCUS_OPTIONS.find(sf => sf.value === formData.salesFocus)?.key || 'OTHER',
            value: formData.salesFocus
          } : undefined,
          industry_vertical: formData.industryVertical ? {
            key: INDUSTRY_OPTIONS.find(iv => iv.value === formData.industryVertical)?.key || 'OTHER',
            value: formData.industryVertical
          } : undefined,
          preferred_chat_times: formData.preferredChatTimes,
          topics_to_discuss: formData.topicsToDiscuss,
          async_communication: formData.asyncCommunication,
          profile_complete: true,
          account_status: {
            key: 'ACTIVE',
            value: 'Active'
          }
        }
      }

      console.log('Submitting user data to API:', {
        title: userData.title,
        type: userData.type,
        slug: userData.slug,
        metadataKeys: Object.keys(userData.metadata)
      })

      // Submit to Cosmic CMS
      const response = await fetch('/api/auth/signup-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })

      const responseData = await response.json()
      console.log('API response:', { status: response.status, data: responseData })

      if (!response.ok) {
        throw new Error(responseData.message || `HTTP ${response.status}: Failed to create profile`)
      }

      const { profile } = responseData
      console.log('Profile created successfully:', profile)
      
      // Redirect to success page or dashboard
      if (profile?.slug) {
        router.push(`/profile/${profile.slug}?welcome=true`)
      } else {
        router.push('/dashboard?welcome=true')
      }
      
    } catch (error: any) {
      console.error('Signup submission error:', error)
      setSubmitError(error.message || 'An unexpected error occurred while creating your profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Account Information</h2>
            
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
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500 ${
                  errors.fullName ? 'border-red-300' : 'border-neutral-300'
                }`}
                placeholder="Enter your full name"
              />
              {errors.fullName && <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>}
            </div>

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
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500 ${
                  errors.email ? 'border-red-300' : 'border-neutral-300'
                }`}
                placeholder="Enter your email address"
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
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
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500 ${
                  errors.password ? 'border-red-300' : 'border-neutral-300'
                }`}
                placeholder="Create a strong password (8+ characters)"
              />
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
            </div>

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
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500 ${
                  errors.confirmPassword ? 'border-red-300' : 'border-neutral-300'
                }`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            <div>
              <label className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-neutral-300 rounded"
                />
                <span className="text-sm text-neutral-700">
                  I agree to the <a href="/terms" className="text-coffee-600 hover:text-coffee-700 underline">Terms of Service</a> and <a href="/privacy" className="text-coffee-600 hover:text-coffee-700 underline">Privacy Policy</a> *
                </span>
              </label>
              {errors.terms && <p className="text-red-600 text-sm mt-1">{errors.terms}</p>}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Professional Information</h2>
            
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
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500 ${
                  errors.currentRole ? 'border-red-300' : 'border-neutral-300'
                }`}
                placeholder="e.g., Senior Account Executive, SDR, Sales Manager"
              />
              {errors.currentRole && <p className="text-red-600 text-sm mt-1">{errors.currentRole}</p>}
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
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500 ${
                  errors.company ? 'border-red-300' : 'border-neutral-300'
                }`}
                placeholder="Enter your company name"
              />
              {errors.company && <p className="text-red-600 text-sm mt-1">{errors.company}</p>}
            </div>

            <div>
              <label htmlFor="linkedinUrl" className="block text-sm font-medium text-neutral-700 mb-2">
                LinkedIn URL
              </label>
              <input
                type="url"
                id="linkedinUrl"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            <div>
              <label htmlFor="profilePicture" className="block text-sm font-medium text-neutral-700 mb-2">
                Profile Picture
              </label>
              <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500"
              />
              <p className="text-sm text-neutral-500 mt-1">Optional: Upload a professional headshot</p>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Professional Details</h2>
            
            <div>
              <label htmlFor="timezone" className="block text-sm font-medium text-neutral-700 mb-2">
                Timezone *
              </label>
              <select
                id="timezone"
                name="timezone"
                required
                value={formData.timezone}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500 ${
                  errors.timezone ? 'border-red-300' : 'border-neutral-300'
                }`}
              >
                <option value="">Select your timezone</option>
                {TIMEZONE_OPTIONS.map(option => (
                  <option key={option.key} value={option.value}>{option.value}</option>
                ))}
              </select>
              {errors.timezone && <p className="text-red-600 text-sm mt-1">{errors.timezone}</p>}
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
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500 ${
                  errors.seniorityLevel ? 'border-red-300' : 'border-neutral-300'
                }`}
              >
                <option value="">Select your seniority level</option>
                {SENIORITY_OPTIONS.map(option => (
                  <option key={option.key} value={option.value}>{option.value}</option>
                ))}
              </select>
              {errors.seniorityLevel && <p className="text-red-600 text-sm mt-1">{errors.seniorityLevel}</p>}
            </div>

            <div>
              <label htmlFor="salesFocus" className="block text-sm font-medium text-neutral-700 mb-2">
                Sales Focus
              </label>
              <select
                id="salesFocus"
                name="salesFocus"
                value={formData.salesFocus}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500"
              >
                <option value="">Select your sales focus</option>
                {SALES_FOCUS_OPTIONS.map(option => (
                  <option key={option.key} value={option.value}>{option.value}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="industryVertical" className="block text-sm font-medium text-neutral-700 mb-2">
                Industry Vertical
              </label>
              <select
                id="industryVertical"
                name="industryVertical"
                value={formData.industryVertical}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500"
              >
                <option value="">Select your industry</option>
                {INDUSTRY_OPTIONS.map(option => (
                  <option key={option.key} value={option.value}>{option.value}</option>
                ))}
              </select>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">About You</h2>
            
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-neutral-700 mb-2">
                Bio *
              </label>
              <textarea
                id="bio"
                name="bio"
                required
                rows={4}
                maxLength={500}
                value={formData.bio}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500 ${
                  errors.bio ? 'border-red-300' : 'border-neutral-300'
                }`}
                placeholder="Tell us about yourself, your experience, and what you're passionate about in sales..."
              />
              <div className="flex justify-between items-center mt-1">
                {errors.bio && <p className="text-red-600 text-sm">{errors.bio}</p>}
                <p className="text-sm text-neutral-500 ml-auto">{formData.bio.length}/500</p>
              </div>
            </div>

            <div>
              <label htmlFor="funFact" className="block text-sm font-medium text-neutral-700 mb-2">
                Fun Fact
              </label>
              <input
                type="text"
                id="funFact"
                name="funFact"
                value={formData.funFact}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500"
                placeholder="Share something interesting about yourself!"
              />
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Preferences</h2>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Preferred Chat Times * (Select all that work for you)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {CHAT_TIME_OPTIONS.map(time => (
                  <label key={time} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.preferredChatTimes.includes(time)}
                      onChange={() => handleMultiSelectChange('preferredChatTimes', time)}
                      className="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-neutral-300 rounded"
                    />
                    <span className="text-sm text-neutral-700">{time}</span>
                  </label>
                ))}
              </div>
              {errors.preferredChatTimes && <p className="text-red-600 text-sm mt-1">{errors.preferredChatTimes}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Topics to Discuss * (Select all that interest you)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {TOPIC_OPTIONS.map(topic => (
                  <label key={topic} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.topicsToDiscuss.includes(topic)}
                      onChange={() => handleMultiSelectChange('topicsToDiscuss', topic)}
                      className="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-neutral-300 rounded"
                    />
                    <span className="text-sm text-neutral-700">{topic}</span>
                  </label>
                ))}
              </div>
              {errors.topicsToDiscuss && <p className="text-red-600 text-sm mt-1">{errors.topicsToDiscuss}</p>}
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="asyncCommunication"
                  checked={formData.asyncCommunication}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-neutral-300 rounded"
                />
                <span className="text-sm text-neutral-700">
                  I'm open to async communication (messaging, email follow-ups)
                </span>
              </label>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="p-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-neutral-700">Step {currentStep} of {totalSteps}</span>
          <span className="text-sm text-neutral-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-2">
          <div 
            className="bg-coffee-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Content */}
      <div className="min-h-[400px]">
        {renderStep()}
      </div>

      {/* Error Message */}
      {submitError && (
        <div className="mt-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          <p className="font-medium">Error creating profile:</p>
          <p>{submitError}</p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8 pt-6 border-t border-neutral-200">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className={`px-6 py-2 border border-neutral-300 rounded-lg font-medium transition-colors ${
            currentStep === 1 
              ? 'text-neutral-400 cursor-not-allowed' 
              : 'text-neutral-700 hover:bg-neutral-50'
          }`}
        >
          Previous
        </button>

        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2 bg-coffee-600 text-white rounded-lg font-medium hover:bg-coffee-700 transition-colors"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-8 py-2 bg-coffee-600 text-white rounded-lg font-medium hover:bg-coffee-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Profile...' : 'Complete Signup'}
          </button>
        )}
      </div>
    </div>
  )
}