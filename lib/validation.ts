export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export function validateEmail(email: string): ValidationResult {
  const errors: string[] = []
  
  if (!email || email.trim().length === 0) {
    errors.push('Email is required')
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      errors.push('Please enter a valid email address')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validateFullName(fullName: string): ValidationResult {
  const errors: string[] = []
  
  if (!fullName || fullName.trim().length === 0) {
    errors.push('Full name is required')
  } else {
    if (fullName.trim().length < 2) {
      errors.push('Full name must be at least 2 characters long')
    }
    if (fullName.trim().length > 100) {
      errors.push('Full name must be less than 100 characters')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validatePassword(password: string): ValidationResult {
  const errors: string[] = []
  
  if (!password || password.trim().length === 0) {
    errors.push('Password is required')
  } else {
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long')
    }
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
  seniorityLevel: string
  industryVertical: string
  bio: string
  terms: boolean
}): ValidationResult {
  const errors: string[] = []
  
  // Validate each field
  const fullNameValidation = validateFullName(data.fullName)
  const emailValidation = validateEmail(data.email)
  const passwordValidation = validatePassword(data.password)
  
  errors.push(...fullNameValidation.errors)
  errors.push(...emailValidation.errors)
  errors.push(...passwordValidation.errors)
  
  // Additional validations
  if (!data.currentRole || data.currentRole.trim().length === 0) {
    errors.push('Current role is required')
  }
  
  if (!data.company || data.company.trim().length === 0) {
    errors.push('Company is required')
  }
  
  if (!data.seniorityLevel || data.seniorityLevel.trim().length === 0) {
    errors.push('Seniority level is required')
  }
  
  if (!data.industryVertical || data.industryVertical.trim().length === 0) {
    errors.push('Industry vertical is required')
  }
  
  if (!data.bio || data.bio.trim().length === 0) {
    errors.push('Bio is required')
  } else if (data.bio.length > 500) {
    errors.push('Bio must be 500 characters or less')
  }
  
  // Password confirmation
  if (data.password !== data.confirmPassword) {
    errors.push('Passwords do not match')
  }
  
  // Terms validation
  if (!data.terms) {
    errors.push('You must accept the terms and conditions')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validateLoginData(data: {
  email: string
  password: string
}): ValidationResult {
  const errors: string[] = []
  
  const emailValidation = validateEmail(data.email)
  const passwordValidation = validatePassword(data.password)
  
  errors.push(...emailValidation.errors)
  errors.push(...passwordValidation.errors)
  
  return {
    isValid: errors.length === 0,
    errors
  }
}