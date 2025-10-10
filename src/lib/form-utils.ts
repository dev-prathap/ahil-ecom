/**
 * Utility functions for form handling and validation
 */

export const formatPhoneNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, "")
  if (cleaned.length >= 6) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`
  } else if (cleaned.length >= 3) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`
  }
  return cleaned
}

export const validateEmail = (email: string): boolean => {
  if (!email) return true // Optional field
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/
  return phoneRegex.test(phone)
}

export const isValidPickupDate = (date: Date): boolean => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date >= today
}