import { bucketName, s3Client } from './client'

import { HeadObjectCommand } from '@aws-sdk/client-s3'

export interface FileMetadata {
  originalName?: string
  contentType?: string
  size?: number
  lastModified?: Date
  metadata?: Record<string, string>
}

/**
 * Get metadata for a file in S3 without downloading the content.
 *
 * @param key - The storage key of the file
 * @returns File metadata including content type, size, and custom metadata
 */
export async function getFileMetadata(key: string): Promise<FileMetadata> {
  const command = new HeadObjectCommand({
    Bucket: bucketName,
    Key: key,
  })

  const response = await s3Client.send(command)

  return {
    originalName: response.Metadata?.originalname,
    contentType: response.ContentType,
    size: response.ContentLength,
    lastModified: response.LastModified,
    metadata: response.Metadata,
  }
}
