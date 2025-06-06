import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors'
import '../broker/subscriber.ts'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider
} from 'fastify-type-provider-zod'

const app = fastify().withTypeProvider<ZodTypeProvider>()

// 📌 Corrigir aqui:
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

// Configuração do CORS
app.register(fastifyCors)

app.listen({ host: '0.0.0.0', port: 3334 }).then(() => {
  console.log('[Invoices] HTTP Server running!')
})
