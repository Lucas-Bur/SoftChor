import { type SyncableTable, TABLE_REGISTRY } from '@repo/database'

export type AllowedTable = SyncableTable

export function isAllowedTable(table: string): table is AllowedTable {
  return table in TABLE_REGISTRY
}

export function getTableForSync(table: AllowedTable) {
  return TABLE_REGISTRY[table]
}
