import type { Context, Next } from "hono";
import { auth } from "../lib/auth.js";

export const protectRoute = async (c: Context, next: Next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user" as string, null);
    c.set("session" as string, null);
    return c.json({ message: "Unauthorized" }, 401);
  }

  c.set("user" as string, session.user);
  c.set("session" as string, session.session);
  return next();
};
