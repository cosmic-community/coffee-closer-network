import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 12

export async function hashPassword(password: string): Promise<string> {
  if (!password || password.trim().length === 0) {
    throw new Error('Password is required')
  }
  
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long')
  }
  
  return await bcrypt.hash(password.trim(), SALT_ROUNDS)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  if (!password || !hashedPassword) {
    return false
  }
  
  try {
    return await bcrypt.compare(password.trim(), hashedPassword)
  } catch (error) {
    console.error('Password verification error:', error)
    return false
  }
}

export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!password || password.trim().length === 0) {
    errors.push('Password is required')
  } else {
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long')
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}