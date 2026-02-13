import { auth, getSession } from '@repo/auth'

import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'

// Re-export auth for use in API routes
export { auth }

// Server function to get the current session
export const getSessionServerFn = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getRequest()
  return getSession(request.headers)
})
