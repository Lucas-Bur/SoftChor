import { getTableName, sql } from 'drizzle-orm'
import {
  bigint,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import type z from 'zod'

export const voiceTypeEnum = pgEnum('voice_type', [
  'SOPRANO',
  'ALTO',
  'TENOR',
  'BASS',
  'OTHER',
  'UNASSIGNED',
])

export const fileTypeEnum = pgEnum('file_type', ['SCORE', 'MUSIC_XML', 'AUDIO'])

export const jobStatusEnum = pgEnum('job_status', ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'])

// Die Spaltennamen dürfen nicht händisch gesetzt werden! Ansonsten kann man das mit electric nicht syncen!
export const songs = pgTable('songs', {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar({ length: 255 }).notNull(),
  status: jobStatusEnum().default('PENDING'),
  startedAt: timestamp({ withTimezone: true }),
  finishedAt: timestamp({ withTimezone: true }),
  errorMessage: text(),
  createdAt: timestamp({ withTimezone: true }).defaultNow(),
  progress: integer().default(0),
})

export const files = pgTable(
  'files',
  {
    id: uuid().primaryKey().defaultRandom(),
    songId: uuid()
      .notNull()
      .references(() => songs.id, { onDelete: 'cascade' }),
    voiceId: uuid().references(() => voices.id, { onDelete: 'cascade' }),
    fileType: fileTypeEnum().notNull(),
    s3Key: text().notNull(),
    originalName: text(),
    sizeBytes: bigint({ mode: 'number' }),
    createdAt: timestamp({ withTimezone: true }).defaultNow(),
  },
  table => [index('idx_files_song').on(table.songId), index('idx_files_voice').on(table.voiceId)]
)

export const voices = pgTable(
  'voices',
  {
    id: uuid().primaryKey().defaultRandom(),
    songId: uuid()
      .notNull()
      .references(() => songs.id, { onDelete: 'cascade' }),
    labelRaw: varchar({ length: 100 }).notNull(),
    voiceType: voiceTypeEnum().default('UNASSIGNED'),
    createdAt: timestamp({ withTimezone: true }).defaultNow(),
  },
  table => [
    index('idx_voices_song').on(table.songId),
    index('idx_voices_unassigned')
      .on(table.songId)
      .where(sql`${table.voiceType} = 'UNASSIGNED'`),
  ]
)

export const insertSongsSchema = createInsertSchema(songs)
export const selectSongsSchema = createSelectSchema(songs)
export type Song = z.infer<typeof selectSongsSchema>

export const insertFilesSchema = createInsertSchema(files)
export const selectFilesSchema = createSelectSchema(files)
export type SongFile = z.infer<typeof selectFilesSchema>

export const insertVoicesSchema = createInsertSchema(voices)
export const selectVoicesSchema = createSelectSchema(voices)
export type SongVoice = z.infer<typeof selectVoicesSchema>

export const SONG_VOICE = voiceTypeEnum.enumValues
export const SONG_FILE = fileTypeEnum.enumValues
export const SONG_STATUS = jobStatusEnum.enumValues

export const scoresSync = {
  [getTableName(songs)]: songs,
  [getTableName(files)]: files,
  [getTableName(voices)]: voices,
} as const
