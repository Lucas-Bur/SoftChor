import { enqueueJob } from './enqueue'
import { type JobMessage } from './types'

const AMQP_URL = process.env.AMQP_URL ?? 'amqp://localhost'
const QUEUE_NAME = process.env.AMQP_QUEUE ?? 'song_jobs'

export async function defaultEnqueueJob(data: JobMessage): Promise<void> {
  await enqueueJob(AMQP_URL, QUEUE_NAME, data)
}
