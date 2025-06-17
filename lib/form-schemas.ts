export interface ProfileFormData {
  full_name: string
  current_role: string
  company: string
  bio: string
  fun_fact?: string
  linkedin_url?: string
  timezone: string
  seniority_level: string
  sales_focus?: string
  industry_vertical?: string
  preferred_chat_times: string[]
  topics_to_discuss: string[]
  async_communication: boolean
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export function validateProfileData(data: ProfileFormData): ValidationResult {
  const errors: string[] = []

  // Required fields validation
  if (!data.full_name?.trim()) {
    errors.push('Full name is required')
  }

  if (!data.current_role?.trim()) {
    errors.push('Current role is required')
  }

  if (!data.company?.trim()) {
    errors.push('Company is required')
  }

  if (!data.bio?.trim()) {
    errors.push('Bio is required')
  } else if (data.bio.length < 50) {
    errors.push('Bio must be at least 50 characters')
  } else if (data.bio.length > 500) {
    errors.push('Bio must be 500 characters or less')
  }

  if (!data.timezone) {
    errors.push('Timezone is required')
  }

  if (!data.seniority_level) {
    errors.push('Seniority level is required')
  }

  if (!data.preferred_chat_times || data.preferred_chat_times.length === 0) {
    errors.push('At least one preferred chat time is required')
  }

  if (!data.topics_to_discuss || data.topics_to_discuss.length === 0) {
    errors.push('At least one topic to discuss is required')
  }

  // Optional field validation
  if (data.linkedin_url && !isValidUrl(data.linkedin_url)) {
    errors.push('LinkedIn URL must be a valid URL')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validateSignupData(data: {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  currentRole: string
  company: string
  timezone: string
  seniorityLevel: string
  terms: boolean
}): ValidationResult {
  const errors: string[] = []

  if (!data.fullName?.trim()) {
    errors.push('Full name is required')
  }

  if (!data.email?.trim()) {
    errors.push('Email is required')
  } else if (!isValidEmail(data.email)) {
    errors.push('Please enter a valid email address')
  }

  if (!data.password) {
    errors.push('Password is required')
  } else if (data.password.length < 8) {
    errors.push('Password must be at least 8 characters')
  }

  if (data.password !== data.confirmPassword) {
    errors.push('Passwords do not match')
  }

  if (!data.currentRole?.trim()) {
    errors.push('Current role is required')
  }

  if (!data.company?.trim()) {
    errors.push('Company is required')
  }

  if (!data.timezone) {
    errors.push('Timezone is required')
  }

  if (!data.seniorityLevel) {
    errors.push('Seniority level is required')
  }

  if (!data.terms) {
    errors.push('You must accept the terms and conditions')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const TIMEZONE_OPTIONS = [
  { value: 'EST', label: 'Eastern Time (EST/EDT)' },
  { value: 'CST', label: 'Central Time (CST/CDT)' },
  { value: 'MST', label: 'Mountain Time (MST/MDT)' },
  { value: 'PST', label: 'Pacific Time (PST/PDT)' },
  { value: 'OTHER', label: 'Other' }
]

export const SENIORITY_OPTIONS = [
  { value: 'SDR', label: 'SDR (Sales Development Rep)' },
  { value: 'AE', label: 'Account Executive' },
  { value: 'SR_AE', label: 'Senior Account Executive' },
  { value: 'MANAGER', label: 'Sales Manager' },
  { value: 'VP', label: 'VP of Sales' },
  { value: 'OTHER', label: 'Other' }
]

export const SALES_FOCUS_OPTIONS = [
  { value: 'OUTBOUND', label: 'Outbound Sales' },
  { value: 'INBOUND', label: 'Inbound Sales' },
  { value: 'SMB', label: 'SMB' },
  { value: 'MID_MARKET', label: 'Mid-Market' },
  { value: 'ENTERPRISE', label: 'Enterprise' },
  { value: 'CHANNEL', label: 'Channel Sales' },
  { value: 'OTHER', label: 'Other' }
]

export const INDUSTRY_OPTIONS = [
  { value: 'SAAS', label: 'SaaS' },
  { value: 'FINTECH', label: 'Fintech' },
  { value: 'HEALTHCARE', label: 'Healthcare' },
  { value: 'MANUFACTURING', label: 'Manufacturing' },
  { value: 'RETAIL', label: 'Retail' },
  { value: 'REAL_ESTATE', label: 'Real Estate' },
  { value: 'TECHNOLOGY', label: 'Technology' },
  { value: 'OTHER', label: 'Other' }
]

export const CHAT_TIME_OPTIONS = [
  'Early Morning (7-9 AM)',
  'Mid Morning (9-11 AM)',
  'Lunch Time (12-1 PM)',
  'Early Afternoon (1-3 PM)',
  'Late Afternoon (3-5 PM)',
  'Evening (5-7 PM)'
]

export const TOPIC_OPTIONS = [
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