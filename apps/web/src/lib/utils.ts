import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const syncEndpointUrl = new URL(
  '/api/sync',
  typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
).toString()
