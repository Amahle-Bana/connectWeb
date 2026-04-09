import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** True if the address is a UFH student email (one local part, ending in @ufh.ac.za). */
export function isUfhStudentEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase()
  return /^[^@\s]+@ufh\.ac\.za$/.test(normalized)
}

const EXTRA_ALLOWED_AUTH_EMAIL = "09munashealvinrukuni@gmail.com"

/** UFH student emails plus explicitly allowed addresses (login / signup on connect web). */
export function isAllowedConnectWebAuthEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase()
  if (normalized === EXTRA_ALLOWED_AUTH_EMAIL) return true
  return isUfhStudentEmail(email)
}