export interface FormErrors {
  [key: string]: string | undefined
}

export function validateSignupForm(formData: any, step: number): FormErrors {
  const errors: FormErrors = {}

  switch (step) {
    case 1:
      // Account Information
      if (!formData.fullName?.trim()) {
        errors.fullName = 'Full name is required'
      } else if (formData.fullName.trim().length < 2) {
        errors.fullName = 'Full name must be at least 2 characters'
      }

      if (!formData.email?.trim()) {
        errors.email = 'Email address is required'
      } else if (!isValidEmail(formData.email)) {
        errors.email = 'Please enter a valid email address'
      }

      if (!formData.password?.trim()) {
        errors.password = 'Password is required'
      } else if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters long'
      }

      if (!formData.confirmPassword?.trim()) {
        errors.confirmPassword = 'Please confirm your password'
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match'
      }

      if (!formData.terms) {
        errors.terms = 'You must agree to the terms and conditions'
      }
      break

    case 2:
      // Professional Information
      if (!formData.currentRole?.trim()) {
        errors.currentRole = 'Current role is required'
      }

      if (!formData.company?.trim()) {
        errors.company = 'Company is required'
      }

      if (formData.linkedinUrl && !isValidUrl(formData.linkedinUrl)) {
        errors.linkedinUrl = 'Please enter a valid LinkedIn URL'
      }

      if (formData.profilePicture && !isValidImageFile(formData.profilePicture)) {
        errors.profilePicture = 'Please select a valid image file (JPG, PNG, GIF, max 5MB)'
      }
      break

    case 3:
      // Professional Details
      if (!formData.timezone) {
        errors.timezone = 'Timezone is required'
      }

      if (!formData.seniorityLevel) {
        errors.seniorityLevel = 'Seniority level is required'
      }
      break

    case 4:
      // About You
      if (!formData.bio?.trim()) {
        errors.bio = 'Bio is required'
      } else if (formData.bio.trim().length < 50) {
        errors.bio = 'Bio must be at least 50 characters'
      } else if (formData.bio.length > 500) {
        errors.bio = 'Bio must be 500 characters or less'
      }
      break

    case 5:
      // Preferences
      if (!formData.preferredChatTimes || formData.preferredChatTimes.length === 0) {
        errors.preferredChatTimes = 'Please select at least one preferred chat time'
      }

      if (!formData.topicsToDiscuss || formData.topicsToDiscuss.length === 0) {
        errors.topicsToDiscuss = 'Please select at least one topic to discuss'
      }
      break
  }

  return errors
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

function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
  const maxSize = 5 * 1024 * 1024 // 5MB
  
  return validTypes.includes(file.type) && file.size <= maxSize
}

export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}