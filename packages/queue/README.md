# @repo/queue

RabbitMQ client and job enqueue utilities for the SoftChor monorepo.

## Usage

```typescript
import { enqueueJob } from '@repo/queue'

await enqueueJob(
  process.env.AMQP_URL!,
  'song_jobs',
  {
    job_id: 'uuid',
    task_type: 'generate_xml_from_input',
    task_params: { input_key: 's3://bucket/key' }
  }
)
```

## Environment Variables

- `AMQP_URL` - RabbitMQ connection URL (default: `amqp://app:app-secret@localhost:5672`)
- `AMQP_QUEUE` - Queue name (default: `song_jobs`)
