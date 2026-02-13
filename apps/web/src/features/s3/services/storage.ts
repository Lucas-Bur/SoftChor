import { eq } from 'drizzle-orm'
import { v7 as uuidv7 } from 'uuid'
import { z } from 'zod'

import { db, generateTxId } from '@repo/database'
import { files as filesTable } from '@repo/database'
import { bucketName, s3Client } from '@repo/storage'

import { authMiddleware } from '@/features/auth/middleware/auth'

import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createServerFn } from '@tanstack/react-start'

const generateKey = (file: File): string => {
  const uuidV7 = uuidv7() // uuidv7 ist eine aktive Entscheidung von mir für die Zeit
  return `uploads/${uuidV7}.${file.name.split('.').pop()}`
}

const uploadFile = async ({ file, key }: { file: File; key?: string }) => {
  const finalKey = key ?? generateKey(file)

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: finalKey,
    Body: Buffer.from(await file.arrayBuffer()),
    ContentType: file.type,
    Metadata: {
      originalName: file.name,
    },
  })

  await s3Client.send(command)

  return {
    key: finalKey,
  }
}

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

    const result = await uploadFile({
      file,
    })

    return {
      key: result.key,
    }
  })

/**
 * Generiert eine Presigned URL für direkten Zugriff auf eine Datei
 * - Für Browser: directer Download/Anzeige (img src, a href)
 * - Für Download: ohne Umweg über deinen Server
 */
const getPresignedUrl = async ({
  key,
  expiresIn = 3600, // Standard: 1 Stunde
}: {
  key: string
  expiresIn?: number
}): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  })

  const url = await getSignedUrl(s3Client, command, { expiresIn })
  return url
}

export const getPresignedUrlsFromKeys = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ keys: z.array(z.string()) }))
  .middleware([authMiddleware])
  .handler(async ({ data: { keys } }) => {
    const urls = await Promise.all(
      keys.map(async key => {
        const url = await getPresignedUrl({ key })
        return { key, url }
      })
    )
    return urls
  })

const deleteFile = async ({ key }: { key: string }) => {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  })
  await s3Client.send(command)
}

export const deleteFileFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ key: z.string() }))
  .middleware([authMiddleware])
  .handler(async ({ data: { key } }) => {
    await deleteFile({ key })
    return { success: true }
  })

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

export const getFileMetadataFn = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ key: z.string() }))
  .middleware([authMiddleware])
  .handler(async ({ data: { key } }) => {
    const { HeadObjectCommand } = await import('@aws-sdk/client-s3')
    const command = new HeadObjectCommand({
      Bucket: bucketName,
      Key: key,
    })
    const response = await s3Client.send(command)
    return {
      originalName: response.Metadata?.originalname,
      contentType: response.ContentType,
      size: response.ContentLength,
    }
  })
