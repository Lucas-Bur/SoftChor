import { createAuthClient } from 'better-auth/react'

/**
 * Better Auth client instance
 *
 * The baseURL uses the current origin, which works in both development and production.
 * Better Auth automatically handles /api/auth/* routes.
 */
export const authClient = createAuthClient({
  baseURL: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
})
