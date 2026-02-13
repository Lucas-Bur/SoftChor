import amqp, { type ChannelModel, type ConfirmChannel } from 'amqplib'

interface State {
  connection: ChannelModel | null
  channel: ConfirmChannel | null
}

const state: State = {
  connection: null,
  channel: null,
}

export async function getChannel(amqpUrl: string, queueName: string) {
  if (state.channel) return state.channel

  if (!amqpUrl) {
    throw new Error('AMQP_URL is not set')
  }

  const connection = await amqp.connect(amqpUrl)
  state.connection = connection

  const channel = await connection.createConfirmChannel()
  await channel.assertQueue(queueName, { durable: true })
  state.channel = channel

  const cleanup = () => {
    state.connection = null
    state.channel = null
  }

  connection.on('error', cleanup)
  connection.on('close', cleanup)

  return channel
}
