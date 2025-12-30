import { S3Client } from '@aws-sdk/client-s3'

const isDevelopment = process.env.NODE_ENV === 'development'

// TODO: weg von proof of concept und richtige Umsetzung

export const s3Client = new S3Client({
  // Für MinIO (Local) nutzen wir einen lokalen Endpoint
  endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
  region: process.env.S3_REGION || 'eu-central-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || 'minioadmin',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || 'minioadmin',
  },

  // WICHTIG: Muss true sein für MinIO und lokale S3-Clones
  forcePathStyle: isDevelopment,
})

export const bucketName = process.env.S3_BUCKET_NAME || 'scores-bucket'
