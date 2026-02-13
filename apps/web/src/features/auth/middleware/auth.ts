import { getSession } from '@repo/auth'

import { redirect } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/react-start'

/**
 * Auth middleware for protecting routes.
 * Redirects to /login if the user is not authenticated.
 * Provides the session in the context for downstream handlers.
 */
export const authMiddleware = createMiddleware({ type: 'request' }).server(
  async ({ next, request }) => {
    const session = await getSession(request.headers)
    if (!session) {
      throw redirect({
        to: '/login',
      })
    }
    return await next({ context: { session } })
  }
)

/**
 * Guest middleware for public-only routes (like login page).
 * Redirects to /profile if the user is already authenticated.
 */
export const guestMiddleware = createMiddleware({ type: 'request' }).server(
  async ({ next, request }) => {
    const session = await getSession(request.headers)
    if (session) {
      throw redirect({
        to: '/profile',
      })
    }
    return await next()
  }
)
