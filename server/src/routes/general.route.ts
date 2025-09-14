import { Hono } from "hono";

const generalRoutes = new Hono()

generalRoutes.get('/api/health', (c) => {
  return c.json({
    "message": "Health Ok"
  })
})

export default generalRoutes