import { broker } from '../broker.ts'

export async function setupOrdersChannel() {
  const channel = await broker.createChannel()
  await channel.assertQueue('orders')
  console.log('[✓] Orders channel is ready.')
  return channel
}
