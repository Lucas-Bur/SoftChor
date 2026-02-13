# @repo/storage

S3/MinIO client and utilities for file operations in the SoftChor monorepo.

## Usage

```typescript
import { s3Client, bucketName, uploadFile, getPresignedUrl } from '@repo/storage'

// Upload a file
await uploadFile('songs/123/audio.mp3', fileBuffer, 'audio/mpeg')

// Get a presigned URL for download
const url = await getPresignedUrl('songs/123/audio.mp3')
```

## Environment Variables

- `S3_ENDPOINT` - S3 endpoint URL (default: `http://localhost:9000` for MinIO)
- `S3_REGION` - AWS region (default: `eu-central-1`)
- `S3_ACCESS_KEY_ID` - AWS access key (default: `minioadmin`)
- `S3_SECRET_ACCESS_KEY` - AWS secret key (default: `minioadmin`)
- `S3_BUCKET_NAME` - S3 bucket name (default: `scores-bucket`)
