import type { db } from './client'
import type { Txid } from '@tanstack/electric-db-collection'

/**
 * Generates a transaction ID for ElectricSQL sync.
 * The ::xid cast strips off the epoch, giving you the raw 32-bit value
 * that matches what PostgreSQL sends in logical replication streams
 * (and then exposed through Electric which we'll match against in the client).
 */
export async function generateTxId(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0]
): Promise<Txid> {
  const result = await tx.execute(`SELECT pg_current_xact_id()::xid::text as txid`)
  const txid = result.rows[0]?.txid

  if (txid === undefined) {
    throw new Error(`Failed to get transaction ID`)
  }

  return parseInt(txid as string, 10)
}
