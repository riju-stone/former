import { Hono } from "hono";
import { auth } from "../lib/auth";

const authRoute = new Hono();

authRoute.on(["POST", "GET"], "/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

export default authRoute;
