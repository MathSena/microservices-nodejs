import { fastify } from 'fastify'
import { randomUUID } from 'node:crypto'
import { fastifyCors } from '@fastify/cors'
import { z } from 'zod'
import { channels } from '../broker/channels/index.ts'

import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider
} from 'fastify-type-provider-zod'
import { db } from '../db/client.ts'
import { schema } from '../db/schema/index.ts'

const app = fastify().withTypeProvider<ZodTypeProvider>()

// 📌 Corrigir aqui:
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

// Configuração do CORS
app.register(fastifyCors)

app.post(
  '/orders',
  {
    schema: {
      body: z
        .object({
          amount: z.number()
        })
        .strict()
    }
  },
  async (request, reply) => {
    const { amount } = request.body
    await channels.orders.sendToQueue(
      'orders',
      Buffer.from(JSON.stringify({ amount }))
    )
    console.log('Sent order to queue with amount:', amount)

    await db.insert(schema.orders).values({
      id: randomUUID(),
      customerId: '1',
      amount
    })

    return reply.status(201).send()
  }
)

app.listen({ host: '0.0.0.0', port: 3333 }).then(() => {
  console.log('[Orders] HTTP Server running!')
})
