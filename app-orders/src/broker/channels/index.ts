import { setupOrdersChannel } from './orders.ts'

export const channels = {
  orders: await setupOrdersChannel()
}
