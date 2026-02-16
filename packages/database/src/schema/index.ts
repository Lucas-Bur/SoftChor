import { authSync } from './auth'
import { scoresSync } from './scores'

export * from './auth'
export * from './scores'

export const TABLE_REGISTRY = { ...authSync, ...scoresSync } as const

export type SyncableTable = keyof typeof TABLE_REGISTRY
