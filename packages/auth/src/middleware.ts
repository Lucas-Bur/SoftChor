import { auth } from './server'

/**
 * Get the session from a request using the auth instance.
 * This is a helper function for use in TanStack Start middleware.
 *
 * @param headers - The request headers (can be from getRequest().headers or request.headers)
 * @returns The session object or null if not authenticated
 */
export async function getSession(headers: Headers) {
  return auth.api.getSession({ headers })
}

/**
 * Type for the session returned by better-auth
 */
export type Session = Awaited<ReturnType<typeof auth.api.getSession>>

/**
 * Type for the user in the session
 */
export type User = NonNullable<Session>['user']
