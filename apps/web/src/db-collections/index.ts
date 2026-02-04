import { FetchError } from '@electric-sql/client'
import { electricCollectionOptions } from '@tanstack/electric-db-collection'
import { createCollection } from '@tanstack/react-db'
import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'
import {
  insertPostsSchema,
  insertUserSchema,
  postsTable,
  selectPostsSchema,
  selectUserSchema,
  usersTable,
} from '@/db/schema/posts'
import { generateTxId, syncEndpointUrl } from '@/lib/utils'

const addUser = createServerFn({
  method: 'POST',
})
  .inputValidator(insertUserSchema)
  .handler(async (insertUser) => {
    insertUser.data.id = undefined

    const result = await db.transaction(async (tx) => {
      const txid = await generateTxId(tx)
      const newItem = await tx
        .insert(usersTable)
        .values(insertUser.data)
        .returning()

      return { item: newItem, txid }
    })

    return result
  })

const addPost = createServerFn({
  method: 'POST',
})
  .inputValidator(insertPostsSchema)
  .handler(async (insertPost) => {
    insertPost.data.id = undefined

    const result = await db.transaction(async (tx) => {
      const txid = await generateTxId(tx)
      const newItem = await tx
        .insert(postsTable)
        .values({
          content: insertPost.data.content,
          title: insertPost.data.title,
          userId: 75,
        })
        .returning()

      return { item: newItem, txid }
    })

    return result
  })

export const usersCollection = createCollection(
  electricCollectionOptions({
    id: 'users',
    shapeOptions: {
      url: syncEndpointUrl,
      params: {
        table: 'users_table', // Matcht den Namen in ALLOWED_TABLES
      },
    },
    schema: selectUserSchema,
    getKey: (item) => item.id,
    onInsert: async ({ transaction }) => {
      const { modified: newUser } = transaction.mutations[0]

      const result = await addUser({
        data: newUser,
      })

      return { txid: result.txid }
    },
  }),
)

export const postsCollection = createCollection(
  electricCollectionOptions({
    id: 'posts',
    shapeOptions: {
      url: syncEndpointUrl,
      params: {
        table: 'posts_table',
      },
      onError: (error) => {
        console.error('Stream error:', error)
        if (error instanceof FetchError && error.status >= 500) {
          return {} // Retry with same params
        }
        // Return void to stop on other errors
      },
    },
    schema: selectPostsSchema,
    getKey: (item) => item.id,
    onInsert: async ({ transaction }) => {
      // ich bin ein bisschen genervt, dass hier der select Part genommen wird. es ergibt ja irgendwie auch sinn, aber irgendwie auch nicht. ich habe ja extra ein insertSchema erstellt
      const { modified: newPost } = transaction.mutations[0]

      const result = await addPost({
        data: newPost,
      })

      return { txid: result.txid }
    },
  }),
)
