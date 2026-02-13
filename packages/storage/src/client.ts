import { S3Client } from '@aws-sdk/client-s3'

export interface StorageConfig {
  endpoint?: string
  region?: string
  accessKeyId: string
  secretAccessKey: string
  bucketName: string
  forcePathStyle?: boolean
}

export function createS3Client(config: StorageConfig) {
  return new S3Client({
    endpoint: config.endpoint,
    region: config.region ?? 'eu-central-1',
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    forcePathStyle: config.forcePathStyle ?? false,
  })
}

// Default client for convenience
export function createDefaultS3Client() {
  const isDevelopment = process.env.NODE_ENV === 'development'

  return createS3Client({
    endpoint: process.env.S3_ENDPOINT ?? 'http://localhost:9000',
    region: process.env.S3_REGION ?? 'eu-central-1',
    accessKeyId: process.env.S3_ACCESS_KEY_ID ?? 'minioadmin',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? 'minioadmin',
    bucketName: process.env.S3_BUCKET_NAME ?? 'scores-bucket',
    forcePathStyle: isDevelopment,
  })
}

export const s3Client = createDefaultS3Client()
export const bucketName = process.env.S3_BUCKET_NAME ?? 'scores-bucket'
