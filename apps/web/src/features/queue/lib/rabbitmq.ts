import amqp, { type ChannelModel, type ConfirmChannel } from 'amqplib'

const AMQP_URL = process.env.AMQP_URL ?? 'amqp://localhost'
const QUEUE_NAME = process.env.AMQP_QUEUE ?? 'song_jobs'

type State = {
  connection: ChannelModel | null
  channel: ConfirmChannel | null
}

const state: State = {
  connection: null,
  channel: null,
}

async function getChannel() {
  if (state.channel) return state.channel

  if (!AMQP_URL) {
    throw new Error('AMQP_URL is not set')
  }

  const connection = await amqp.connect(AMQP_URL)
  state.connection = connection

  const channel = await connection.createConfirmChannel()
  await channel.assertQueue(QUEUE_NAME, { durable: true })
  state.channel = channel

  const cleanup = () => {
    state.connection = null
    state.channel = null
  }

  connection.on('error', cleanup)
  connection.on('close', cleanup)

  return channel
}

// TODO: Nicht nur als object lassen, sondern als guten Typen oder Schema herausziehen. Ziel ist es
// die Definition mit der Python Anwendung zu teilen
export async function enqueueJob(data: object): Promise<void> {
  const ch = await getChannel()
  const payload = Buffer.from(JSON.stringify(data), 'utf8')

  const sent = ch.sendToQueue(QUEUE_NAME, payload, {
    contentType: 'application/json',
    persistent: true,
  })

  if (!sent) {
    // backpressure: wait for drain
    await new Promise<void>((resolve) => ch.once('drain', resolve))
  }

  // confirm publish (ensures broker received it)
  await ch.waitForConfirms()
}
