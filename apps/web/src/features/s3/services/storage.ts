import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { db, files as filesTable, generateTxId } from '@repo/database'
import {
  deleteFile,
  generateStorageKey,
  getFileMetadata,
  getPresignedUrls,
  uploadFile,
} from '@repo/storage'

import { authMiddleware } from '@/features/auth/middleware/auth'

import { createServerFn } from '@tanstack/react-start'

/**
 * Upload a file to S3 storage.
 * Server function with auth middleware.
 */
export const uploadFileFn = createServerFn({ method: 'POST' })
  .inputValidator(z.instanceof(FormData))
  .middleware([authMiddleware])
  .handler(async ({ data: formData }) => {
    const file = formData.get('file') as File
    if (!file) {
      throw new Error('No file provided')
    }
    if (!(file instanceof File)) {
      throw new Error('File is not a valid File object')
    }

    const key = generateStorageKey(file.name)
    await uploadFile(Buffer.from(await file.arrayBuffer()), {
      key,
      contentType: file.type,
      metadata: { originalName: file.name },
    })

    return { key }
  })

/**
 * Get presigned URLs for multiple files.
 * Server function with auth middleware.
 */
export const getPresignedUrlsFn = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ keys: z.array(z.string()) }))
  .middleware([authMiddleware])
  .handler(async ({ data: { keys } }) => {
    return getPresignedUrls(keys)
  })

/**
 * Delete a file from S3 storage.
 * Server function with auth middleware.
 */
export const deleteFileFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ key: z.string() }))
  .middleware([authMiddleware])
  .handler(async ({ data: { key } }) => {
    await deleteFile(key)
    return { success: true }
  })

/**
 * Delete a file record from the database.
 * Server function with auth middleware.
 */
export const deleteFileFromDbFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.string() }))
  .middleware([authMiddleware])
  .handler(async ({ data: { id } }) => {
    await db.transaction(async tx => {
      await generateTxId(tx)
      await tx.delete(filesTable).where(eq(filesTable.id, id))
    })
    return { success: true }
  })

/**
 * Get metadata for a file from S3.
 * Server function with auth middleware.
 */
export const getFileMetadataFn = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ key: z.string() }))
  .middleware([authMiddleware])
  .handler(async ({ data: { key } }) => {
    return getFileMetadata(key)
  })
