/**
 * Type representing allowed syncable tables
 */
export type AllowedTable = 'songs' | 'files' | 'voices' | 'users' | 'posts'

/**
 * Registry of all syncable tables
 */
export const TABLE_REGISTRY: Record<string, string> = {
  songs: 'songs',
  files: 'files',
  voices: 'voices',
  users: 'users_table',
  posts: 'posts_table',
}

/**
 * Check if a table name is allowed for sync
 * @param table - The table name to check
 * @returns True if the table is allowed for sync
 */
export function isAllowedTable(table: string): table is AllowedTable {
  return table in TABLE_REGISTRY
}

/**
 * Get the database table name for a syncable table
 * @param table - The syncable table name
 * @returns The database table name
 */
export function getTableForSync(table: AllowedTable): string {
  return TABLE_REGISTRY[table]
}
