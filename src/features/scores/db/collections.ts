import { FetchError } from '@electric-sql/client'
import { electricCollectionOptions } from '@tanstack/electric-db-collection'
import { createCollection } from '@tanstack/react-db'
import { createServerFn } from '@tanstack/react-start'
import { getTableName } from 'drizzle-orm'
import { db } from '@/db'
import {
  files,
  insertSongsSchema,
  selectFilesSchema,
  selectSongsSchema,
  selectVoicesSchema,
  songs,
  voices,
} from '@/features/scores/db/schema'
import { generateTxId, syncEndpointUrl } from '@/lib/utils'

export const addSong = createServerFn({
  method: 'POST',
})
  .inputValidator(insertSongsSchema)
  .handler(async (insertSong) => {
    const result = await db.transaction(async (tx) => {
      const txid = await generateTxId(tx)
      const newItem = await tx
        .insert(songs)
        .values({
          title: insertSong.data.title,
        })
        .returning()
      return { item: newItem, txid }
    })
    return result
  })

export const songsCollection = createCollection(
  electricCollectionOptions({
    id: 'songs', // auch getTableName?
    shapeOptions: {
      url: syncEndpointUrl,
      params: {
        table: getTableName(songs),
      },
      onError: (error) => {
        console.error('Stream error:', error)
        if (error instanceof FetchError && error.status >= 500) {
          return {} // Retry with same params
        }
        // Return void to stop on other errors
      },
    },
    schema: selectSongsSchema,
    getKey: (item) => item.id,
    onInsert: async ({ transaction }) => {
      // Ichh bin ein bisschen genervt, dass hier der Select Part genommen wird.
      // Es ergibt ja irgendwie auch sinn, aber irgendwie auch nicht.
      // Ein weiteres Feld wie insertSchema wäre super!
      // Ich habe ja extra ein schema, was sich hier wieder perfekt anbieten würde.
      const { modified: newSong } = transaction.mutations[0]

      const result = await addSong({
        data: newSong,
      })

      return { txid: result.txid }
    },
  }),
)

export const filesCollection = createCollection(
  electricCollectionOptions({
    id: 'files',
    shapeOptions: {
      url: syncEndpointUrl,
      params: {
        table: getTableName(files),
      },
      onError: (error) => {
        console.error('Stream error:', error)
        if (error instanceof FetchError && error.status >= 500) {
          return {} // Retry with same params
        }
        // Return void to stop on other errors
      },
    },
    schema: selectFilesSchema,
    getKey: (item) => item.id,
  }),
)

export const voicesCollection = createCollection(
  electricCollectionOptions({
    id: 'voices',
    shapeOptions: {
      url: syncEndpointUrl,
      params: {
        table: getTableName(voices),
      },
      onError: (error) => {
        console.error('Stream error:', error)
        if (error instanceof FetchError && error.status >= 500) {
          return {} // Retry with same params
        }
        // Return void to stop on other errors
      },
    },
    schema: selectVoicesSchema,
    getKey: (item) => item.id,
  }),
)
