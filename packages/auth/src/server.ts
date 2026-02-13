import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

import { db } from '@repo/database'
import * as schema from '@repo/database'

/**
 * Better Auth instance configured for the SoftChor application
 *
 * Configuration:
 * - BETTER_AUTH_SECRET: Secret key for encryption (required)
 * - BETTER_AUTH_URL: Base URL for the application (required for callbacks)
 *
 * The baseURL is automatically read from BETTER_AUTH_URL environment variable.
 */
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
    transaction: true,
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  plugins: [tanstackStartCookies()],
})

export type Auth = typeof auth
