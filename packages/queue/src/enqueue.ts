import { getChannel } from './client'

import type { JobMessage } from './types'

export async function enqueueJob(
  amqpUrl: string,
  queueName: string,
  data: JobMessage
): Promise<void> {
  const ch = await getChannel(amqpUrl, queueName)
  const payload = Buffer.from(JSON.stringify(data), 'utf8')

  const sent = ch.sendToQueue(queueName, payload, {
    contentType: 'application/json',
    persistent: true,
  })

  if (!sent) {
    // backpressure: wait for drain
    await new Promise<void>(resolve => ch.once('drain', resolve))
  }

  // confirm publish
  await ch.waitForConfirms()
}
