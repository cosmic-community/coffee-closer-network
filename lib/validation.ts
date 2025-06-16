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

export function validateCurrentRole(role: string): ValidationResult {
  const errors: string[] = []
  
  if (!role || role.trim().length === 0) {
    errors.push('Current role is required')
  } else {
    if (role.trim().length < 2) {
      errors.push('Current role must be at least 2 characters long')
    }
    if (role.trim().length > 100) {
      errors.push('Current role must be less than 100 characters')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validateSeniorityLevel(level: string): ValidationResult {
  const errors: string[] = []
  const validLevels = ['SDR', 'BDR', 'AE', 'SR_AE', 'AM', 'CSM', 'MANAGER', 'DIRECTOR', 'VP']
  
  if (!level || level.trim().length === 0) {
    errors.push('Seniority level is required')
  } else if (!validLevels.includes(level)) {
    errors.push('Please select a valid seniority level')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validateIndustryVertical(industry: string): ValidationResult {
  const errors: string[] = []
  const validIndustries = ['SAAS', 'FINTECH', 'HEALTHCARE', 'EDTECH', 'ECOMMERCE', 'MARTECH', 'CYBERSECURITY', 'OTHER']
  
  if (!industry || industry.trim().length === 0) {
    errors.push('Industry vertical is required')
  } else if (!validIndustries.includes(industry)) {
    errors.push('Please select a valid industry vertical')
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
  seniorityLevel: string
  industryVertical: string
  terms: boolean
}): ValidationResult {
  const errors: string[] = []
  
  // Validate each field
  const fullNameValidation = validateFullName(data.fullName)
  const emailValidation = validateEmail(data.email)
  const roleValidation = validateCurrentRole(data.currentRole)
  const seniorityValidation = validateSeniorityLevel(data.seniorityLevel)
  const industryValidation = validateIndustryVertical(data.industryVertical)
  
  errors.push(...fullNameValidation.errors)
  errors.push(...emailValidation.errors)
  errors.push(...roleValidation.errors)
  errors.push(...seniorityValidation.errors)
  errors.push(...industryValidation.errors)
  
  // Password validation
  if (!data.password || data.password.trim().length === 0) {
    errors.push('Password is required')
  } else if (data.password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  // Confirm password validation
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
  errors.push(...emailValidation.errors)
  
  if (!data.password || data.password.trim().length === 0) {
    errors.push('Password is required')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}