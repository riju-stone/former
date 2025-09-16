import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { logger } from "hono/logger";
import authRoute from "@routes/auth.route";
import { compress } from "hono/compress";
import { protectRoute } from "@middleware/auth.middleware";
import generalRoutes from "@routes/general.route";
import { env } from "./env";
import formRoute from "@routes/form.route";

const nodeEnv = env.NODE_ENV || "dev";
console.warn(`Running in ${nodeEnv} mode`);
console.warn("In dev mode, some security features are disabled.");

// App
const app = new Hono();

// Middleware
if (nodeEnv === "prod") {
  app.use(
    csrf({
      origin: ["http://localhost:3000", "https://formerapp.vercel.app"],
    })
  );
}
app.use(logger());
app.use(compress({ encoding: "gzip" }));

// Added Security
if (nodeEnv === "prod") {
  app.use(
    "*",
    cors({
      origin: ["http://localhost:3000", "https://formerapp.vercel.app"],
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "OPTIONS", "PATCH", "DELETE"],
      exposeHeaders: ["Content-Length"],
      maxAge: 86400,
      credentials: true,
    })
  );
}

// Protected Routes Middleware
app.use("/api/form/builder/*", protectRoute);

// Routes
app.route("/api", generalRoutes);
app.route("/api", authRoute);
app.route("/api", formRoute);

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
