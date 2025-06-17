export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export interface ProfileFormData {
  full_name?: string
  email_address?: string
  current_role?: string
  company?: string
  linkedin_url?: string
  bio?: string
  fun_fact?: string
  timezone?: string
  seniority_level?: string
  sales_focus?: string
  industry_vertical?: string
  preferred_chat_times?: string[]
  topics_to_discuss?: string[]
  async_communication?: boolean
}

export function validateProfileData(data: ProfileFormData): ValidationResult {
  const errors: string[] = []

  // Required fields validation
  if (!data.full_name || data.full_name.trim().length === 0) {
    errors.push('Full name is required')
  }

  if (!data.current_role || data.current_role.trim().length === 0) {
    errors.push('Current role is required')
  }

  if (!data.company || data.company.trim().length === 0) {
    errors.push('Company is required')
  }

  // Email validation (if provided)
  if (data.email_address && data.email_address.length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email_address)) {
      errors.push('Please enter a valid email address')
    }
  }

  // LinkedIn URL validation (if provided)
  if (data.linkedin_url && data.linkedin_url.length > 0) {
    try {
      new URL(data.linkedin_url)
    } catch {
      errors.push('Please enter a valid LinkedIn URL')
    }
  }

  // Bio length validation
  if (data.bio && data.bio.length > 500) {
    errors.push('Bio must be 500 characters or less')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validateRequiredFields(data: ProfileFormData, requiredFields: string[]): ValidationResult {
  const errors: string[] = []

  requiredFields.forEach(field => {
    const value = data[field as keyof ProfileFormData]
    if (!value || (typeof value === 'string' && value.trim().length === 0)) {
      errors.push(`${field.replace('_', ' ')} is required`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors
  }
}