import { bucketName, s3Client } from './client'

import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

/**
 * Get a presigned URL for downloading a file from S3.
 *
 * @param key - The storage key of the file
 * @param expiresIn - URL expiration time in seconds (default: 3600)
 * @returns A presigned URL for downloading
 */
export async function getPresignedUrl(key: string, expiresIn = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  })

  return getSignedUrl(s3Client, command, { expiresIn })
}

/**
 * Get presigned URLs for multiple files in batch.
 *
 * @param keys - Array of storage keys
 * @param expiresIn - URL expiration time in seconds (default: 3600)
 * @returns Array of objects with key and url
 */
export async function getPresignedUrls(
  keys: string[],
  expiresIn = 3600
): Promise<Array<{ key: string; url: string }>> {
  return Promise.all(
    keys.map(async key => ({
      key,
      url: await getPresignedUrl(key, expiresIn),
    }))
  )
}
