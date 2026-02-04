import { getTableName } from 'drizzle-orm'

import { authSync } from '@/features/auth/db/schema'
import { scoresSync } from '@/features/scores/db/schema'
import { postsSync } from './posts'

export * from '@/features/auth/db/schema'
export * from '@/features/scores/db/schema'
export * from './posts'

const ALL_SYNCABLE = [...authSync, ...postsSync, ...scoresSync] as const
const ALL_SYNCABLE_NAMES = ALL_SYNCABLE.map((pgTable) => getTableName(pgTable))

export type SyncableTable = (typeof ALL_SYNCABLE_NAMES)[number] // "users_table" | "user" | "posts_table"

export const TABLE_REGISTRY = Object.fromEntries(
  ALL_SYNCABLE.map((table) => [getTableName(table), table]),
) as Record<SyncableTable, (typeof ALL_SYNCABLE)[number]>
