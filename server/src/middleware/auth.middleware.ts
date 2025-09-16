import type { Context, Next } from "hono";
import { auth } from "../lib/auth.js";

export const protectRoute = async (c: Context, next: Next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user" as never, null);
    c.set("session" as never, null);
    return c.json({ message: "Unauthorized" }, 401);
  }

  c.set("user" as never, session.user);
  c.set("session" as never, session.session);
  return next();
};
