import { drizzle } from 'drizzle-orm/neon-serverless'
import ws from 'ws'

import * as schema from './schema'

import { neonConfig, Pool } from '@neondatabase/serverless'

/**
 * Database client for Neon serverless PostgreSQL.
 *
 * Configuration:
 * - DATABASE_URL: Connection string (required)
 *
 * For Neon serverless, WebSocket is configured automatically in Node.js environments.
 *
 * References:
 * - https://github.com/neondatabase/serverless/blob/main/CONFIG.md#websocketconstructor-typeof-websocket--undefined
 * - https://neon.com/docs/guides/drizzle
 * - https://orm.drizzle.team/docs/tutorials/drizzle-with-neon
 *
 * Note: Uses lazy initialization to avoid throwing errors during client-side bundling.
 * The database is only initialized when actually used on the server.
 */

type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>

let _db: DrizzleDb | null = null

/**
 * Get the database instance, initializing it lazily on first access.
 * This prevents the DATABASE_URL check from running at module evaluation time.
 */
function getDb(): DrizzleDb {
  if (!_db) {
    const connectionString = process.env.DATABASE_URL

    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set')
    }

    /**
     * Configure WebSocket for Neon in Node.js environment
     * This is required for Neon serverless to work properly
     */
    neonConfig.webSocketConstructor = ws

    const sql = new Pool({ connectionString })
    _db = drizzle({ client: sql, schema })
  }
  return _db
}

/**
 * Database client with lazy initialization.
 * The actual connection is established on first use, not at import time.
 */
export const db = new Proxy({} as DrizzleDb, {
  get(_, prop) {
    const database = getDb()
    const value = database[prop as keyof DrizzleDb]
    if (typeof value === 'function') {
      return value.bind(database)
    }
    return value
  },
})
