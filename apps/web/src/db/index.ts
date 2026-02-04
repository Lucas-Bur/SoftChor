import { neonConfig, Pool } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-serverless'
import ws from 'ws'

import * as schema from './schema'

/**
 * Das ist ein riesiger Aufwand das besonders aufzusetzen. Hier die Quellen, wie das in diesem speziellen Fall gemacht werden muss.
 *
 * https://github.com/neondatabase/serverless/blob/main/CONFIG.md#websocketconstructor-typeof-websocket--undefined
 * https://neon.com/docs/guides/drizzle
 * https://orm.drizzle.team/docs/tutorials/drizzle-with-neon
 */

neonConfig.webSocketConstructor = ws

const sql = new Pool({ connectionString: process.env.DATABASE_URL! })
export const db = drizzle({ client: sql, schema })
