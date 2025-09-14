import { Hono } from "hono"
import { auth } from "@lib/auth"

const authRoute = new Hono()

authRoute.on(["POST", "GET"], "/auth/*", (c) => {
  return auth.handler(c.req.raw)
})

authRoute.get("/session", (c) => {
  const session = c.get("session" as never)
  const user = c.get("user" as never)

  if (!user) return c.json({
    "message": "User not authenticated"
  }, 401)

  return c.json({
    session,
    user
  })
})

export default authRoute