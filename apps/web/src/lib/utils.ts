import type { Txid } from '@tanstack/electric-db-collection'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { db } from '@/db'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function generateTxId(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
): Promise<Txid> {
  // The ::xid cast strips off the epoch, giving you the raw 32-bit value
  // that matches what PostgreSQL sends in logical replication streams
  // (and then exposed through Electric which we'll match against
  // in the client).
  const result = await tx.execute(
    `SELECT pg_current_xact_id()::xid::text as txid`,
  )
  const txid = result.rows[0]?.txid

  if (txid === undefined) {
    throw new Error(`Failed to get transaction ID`)
  }

  return parseInt(txid as string, 10)
}

export const syncEndpointUrl = new URL(
  '/api/sync',
  typeof window !== 'undefined'
    ? window.location.origin
    : 'http://localhost:3000',
).toString()
