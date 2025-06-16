'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from './Toast'

interface ProfileData {
  full_name: string
  bio: string
  location: string
  coffee_preference: string
  expertise: string[]
  communication_style: string
  availability: string
  phone: string
  linkedin: string
  twitter: string
  website: string
  interests: string[]
  preferred_meeting_location: string
  years_experience: string
  company: string
  role: string
  seeking_mentor: boolean
  willing_to_mentor: boolean
  open_to_collaborations: boolean
  async_communication: boolean
}

interface ProfileFormProps {
  initialData?: Partial<ProfileData>
  onSuccess?: () => void
}

const expertiseOptions = [
  'Software Development',
  'Product Management', 
  'Marketing',
  'Sales',
  'Design',
  'Data Science',
  'Finance',
  'Operations',
  'HR',
  'Legal',
  'Consulting',
  'Entrepreneurship'
]

const interestOptions = [
  'Startups',
  'Technology',
  'AI/ML',
  'Blockchain',
  'Sustainability',
  'Healthcare',
  'Education',
  'Fintech',
  'E-commerce',
  'Social Impact',
  'Gaming',
  'Media'
]

export default function ProfileForm({ initialData, onSuccess }: ProfileFormProps) {
  const router = useRouter()
  const { showSuccess, showError } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState<ProfileData>({
    full_name: initialData?.full_name || '',
    bio: initialData?.bio || '',
    location: initialData?.location || '',
    coffee_preference: initialData?.coffee_preference || '',
    expertise: initialData?.expertise || [],
    communication_style: initialData?.communication_style || '',
    availability: initialData?.availability || '',
    phone: initialData?.phone || '',
    linkedin: initialData?.linkedin || '',
    twitter: initialData?.twitter || '',
    website: initialData?.website || '',
    interests: initialData?.interests || [],
    preferred_meeting_location: initialData?.preferred_meeting_location || '',
    years_experience: initialData?.years_experience || '',
    company: initialData?.company || '',
    role: initialData?.role || '',
    seeking_mentor: initialData?.seeking_mentor || false,
    willing_to_mentor: initialData?.willing_to_mentor || false,
    open_to_collaborations: initialData?.open_to_collaborations || false,
    async_communication: initialData?.async_communication || false
  })

  const handleInputChange = (field: keyof ProfileData, value: string | boolean | string[]) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleExpertiseChange = (expertise: string) => {
    setProfile(prev => ({
      ...prev,
      expertise: prev.expertise.includes(expertise)
        ? prev.expertise.filter(e => e !== expertise)
        : [...prev.expertise, expertise]
    }))
  }

  const handleInterestChange = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/profile/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
        credentials: 'include'
      })

      if (response.ok) {
        showSuccess('Profile saved successfully!')
        if (onSuccess) {
          onSuccess()
        } else {
          router.push('/dashboard')
        }
      } else {
        const error = await response.json()
        showError('Failed to save profile', error.error || 'Please try again.')
      }
    } catch (error) {
      console.error('Profile setup error:', error)
      showError('An error occurred', 'Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={profile.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={profile.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="City, State/Country"
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Bio
          </label>
          <textarea
            rows={4}
            value={profile.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            placeholder="Tell us about yourself, your background, and what you're passionate about..."
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Professional Information */}
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Professional Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Company
            </label>
            <input
              type="text"
              value={profile.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Role/Title
            </label>
            <input
              type="text"
              value={profile.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Years of Experience
            </label>
            <select
              value={profile.years_experience}
              onChange={(e) => handleInputChange('years_experience', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
            >
              <option value="">Select...</option>
              <option value="0-2">0-2 years</option>
              <option value="3-5">3-5 years</option>
              <option value="6-10">6-10 years</option>
              <option value="11-15">11-15 years</option>
              <option value="16+">16+ years</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expertise */}
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Areas of Expertise</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {expertiseOptions.map((expertise) => (
            <label key={expertise} className="flex items-center">
              <input
                type="checkbox"
                checked={profile.expertise.includes(expertise)}
                onChange={() => handleExpertiseChange(expertise)}
                className="mr-2 text-coffee-600 focus:ring-coffee-500"
              />
              <span className="text-sm text-neutral-700">{expertise}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Interests</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {interestOptions.map((interest) => (
            <label key={interest} className="flex items-center">
              <input
                type="checkbox"
                checked={profile.interests.includes(interest)}
                onChange={() => handleInterestChange(interest)}
                className="mr-2 text-coffee-600 focus:ring-coffee-500"
              />
              <span className="text-sm text-neutral-700">{interest}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Coffee & Meeting Preferences */}
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Coffee & Meeting Preferences</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Coffee Preference
            </label>
            <select
              value={profile.coffee_preference}
              onChange={(e) => handleInputChange('coffee_preference', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
            >
              <option value="">Select...</option>
              <option value="Espresso">Espresso</option>
              <option value="Americano">Americano</option>
              <option value="Latte">Latte</option>
              <option value="Cappuccino">Cappuccino</option>
              <option value="Cold Brew">Cold Brew</option>
              <option value="Tea">Tea</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Preferred Meeting Location
            </label>
            <input
              type="text"
              value={profile.preferred_meeting_location}
              onChange={(e) => handleInputChange('preferred_meeting_location', e.target.value)}
              placeholder="Coffee shop, office, virtual, etc."
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Communication & Networking */}
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Communication & Networking</h2>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={profile.seeking_mentor}
                onChange={(e) => handleInputChange('seeking_mentor', e.target.checked)}
                className="mr-2 text-coffee-600 focus:ring-coffee-500"
              />
              <span className="text-sm text-neutral-700">Seeking a mentor</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={profile.willing_to_mentor}
                onChange={(e) => handleInputChange('willing_to_mentor', e.target.checked)}
                className="mr-2 text-coffee-600 focus:ring-coffee-500"
              />
              <span className="text-sm text-neutral-700">Willing to mentor others</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={profile.open_to_collaborations}
                onChange={(e) => handleInputChange('open_to_collaborations', e.target.checked)}
                className="mr-2 text-coffee-600 focus:ring-coffee-500"
              />
              <span className="text-sm text-neutral-700">Open to collaborations</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={profile.async_communication}
                onChange={(e) => handleInputChange('async_communication', e.target.checked)}
                className="mr-2 text-coffee-600 focus:ring-coffee-500"
              />
              <span className="text-sm text-neutral-700">Prefer async communication</span>
            </label>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Contact & Social</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Phone (Optional)
            </label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              LinkedIn URL
            </label>
            <input
              type="url"
              value={profile.linkedin}
              onChange={(e) => handleInputChange('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Twitter/X Handle
            </label>
            <input
              type="text"
              value={profile.twitter}
              onChange={(e) => handleInputChange('twitter', e.target.value)}
              placeholder="@yourusername"
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Website
            </label>
            <input
              type="url"
              value={profile.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://yourwebsite.com"
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-coffee-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-coffee-700 focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </form>
  )
}