import { bucketName, s3Client } from './client'

import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export interface UploadOptions {
  key: string
  contentType: string
  metadata?: Record<string, string>
}

/**
 * Upload a file to S3 storage.
 *
 * @param body - The file content as Buffer, Uint8Array, or string
 * @param options - Upload options including key, contentType, and optional metadata
 * @returns The key of the uploaded file
 */
export async function uploadFile(
  body: Buffer | Uint8Array | string,
  options: UploadOptions
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: options.key,
    Body: body,
    ContentType: options.contentType,
    Metadata: options.metadata,
  })

  await s3Client.send(command)
  return options.key
}

/**
 * Get a presigned URL for uploading a file directly to S3.
 *
 * @param key - The storage key for the file
 * @param contentType - The content type of the file
 * @param expiresIn - URL expiration time in seconds (default: 3600)
 * @returns A presigned URL for uploading
 */
export async function getUploadUrl(
  key: string,
  contentType: string,
  expiresIn = 3600
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  })

  return getSignedUrl(s3Client, command, { expiresIn })
}
