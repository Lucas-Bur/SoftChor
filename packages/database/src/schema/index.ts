import { getTableName } from 'drizzle-orm'

import { authSync } from './auth'
import { scoresSync } from './scores'

export * from './auth'
export * from './scores'

const ALL_SYNCABLE = [...authSync, ...scoresSync] as const
const _ALL_SYNCABLE_NAMES = ALL_SYNCABLE.map(pgTable => getTableName(pgTable))

export type SyncableTable = (typeof _ALL_SYNCABLE_NAMES)[number] // "users_table" | "user" | "posts_table"

export const TABLE_REGISTRY = Object.fromEntries(
  ALL_SYNCABLE.map(table => [getTableName(table), table])
) as Record<SyncableTable, (typeof ALL_SYNCABLE)[number]>
