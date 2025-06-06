import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgres://docker:docker@localhost:5482/orders'
  },
  schema: 'src/db/schema/*',
  out: 'src/db/migrations',
  casing: 'snake_case'
})
