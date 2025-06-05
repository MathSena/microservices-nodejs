import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors'
import { z } from 'zod'
import { channels } from '../broker/channels/index.ts'

import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider
} from 'fastify-type-provider-zod'

const app = fastify().withTypeProvider<ZodTypeProvider>()

// Configuração do CORS
app.get('/health', () => {
  return 'OK'
})

app.post(
  '/orders',
  {
    schema: {
      body: z.object({
        amount: z.number()
      })
    }
  },
  async (request, reply) => {
    const { amount } = request.body
    await channels.orders.sendToQueue(
      'orders',
      Buffer.from(JSON.stringify({ amount }))
    )
    console.log('Sent order to queue with amount:', amount)
    return reply.status(201).send()
  }
)

app.listen({ host: '0.0.0.0', port: 3333 }).then(() => {
  console.log('[Orders] HTTP Server running!')
})
