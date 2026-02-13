import { bucketName, s3Client } from './client'

import { DeleteObjectCommand } from '@aws-sdk/client-s3'

export async function deleteFile(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  })

  await s3Client.send(command)
}
