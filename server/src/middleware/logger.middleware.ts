import customLogger from "../utils/logger";
import { Next, Context } from "hono";

export function logRoutes(c: Context, next: Next) {
  customLogger.info(`${c.req.method} | ${c.req.url} | ${c.res.status}`);
  return next();
}
