import { type SyncableTable, TABLE_REGISTRY } from '@repo/database'

/**
 * Check if a table name is allowed for sync
 * @param table - The table name to check
 * @returns True if the table is allowed for sync
 */
export function isAllowedTable(table: string): table is SyncableTable {
  return table in TABLE_REGISTRY
}

/**
 * Get the database table name for a syncable table
 * @param table - The syncable table name
 * @returns The database table name
 */
export function getTableForSync<T extends SyncableTable>(table: T): (typeof TABLE_REGISTRY)[T] {
  return TABLE_REGISTRY[table]
}
