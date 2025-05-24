
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { auth } from './lib/auth.js'

import type { Session } from "./types.js"

const app = new Hono<{ Variables: Session }>()

// Routes
app.get('/health', (c) => {
  return c.text('OK')
})

// Configure CORS
app.use("/api/auth/*", cors({
  origin: '*', // Allow all origins
  allowHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
  allowMethods: ['GET', 'POST', 'OPTIONS'], // Allow specific methods
  exposeHeaders: ['Content-Length'], // Expose specific headers
  maxAge: 600, // Cache preflight response for 10 minutes
  credentials: true // Allow credentials
}))

// Middleware for Session Management
app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  
  if (!session) {
    c.set('user', null)
    c.set('session', null)
    return next()
  }

  c.set('user', session.user)
  c.set('session', session)
  return next()
})

app.on(["GET", "POST"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw)
})


// Start listening on port
const server = serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})

// Implement Graceful Shutdown
process.on("SIGINT", () => {
  server.close()
  process.exit(0)
})
process.on("SIGTERM", () => {
  server.close((err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    process.exit(0)
  })
})