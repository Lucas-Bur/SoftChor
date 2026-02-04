import { createAuthClient } from 'better-auth/react'

// Wahrscheinlich kann ich den komplett entfernen?
export const authClient = createAuthClient({
  baseURL: process.env.VITE_BASE_URL || 'http://localhost:3000',
})
