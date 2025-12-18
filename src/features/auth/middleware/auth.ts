import { redirect } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/react-start'
import { auth } from '@/features/auth/lib/auth-server'

export const authMiddleware = createMiddleware({ type: 'request' }).server(
  async ({ next, request }) => {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) {
      throw redirect({
        to: '/login',
      })
    }
    return await next()
  },
)

export const guestMiddleware = createMiddleware({ type: 'request' }).server(
  async ({ next, request }) => {
    const session = await auth.api.getSession({ headers: request.headers })
    if (session) {
      throw redirect({
        to: '/profile',
      })
    }
    return await next()
  },
)
