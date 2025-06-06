import { setupOrdersChannel } from './channels/orders.ts'

setupOrdersChannel().then(orders => {
  orders.consume(
    'orders',
    async message => {
      if (!message) return null

      console.log(message.content.toString())
      orders.ack(message)
    },
    { noAck: false }
  )
})
