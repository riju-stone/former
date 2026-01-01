import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import authRoute from "./routes/auth.route.js";
import { compress } from "hono/compress";
import { protectRoute } from "./middleware/auth.middleware.js";
import generalRoutes from "./routes/general.route.js";
import { env } from "./env.js";
import formRoute from "./routes/form.route.js";
import customLogger from "./utils/logger.js";
import { logRoutes } from "./middleware/logger.middleware.js";

const nodeEnv = env.NODE_ENV || "dev";
customLogger.warn(`Running in ${nodeEnv} mode`);

if (nodeEnv === "dev") {
  customLogger.warn("In dev mode, some security features are disabled.");
}

// App
const app = new Hono();

// Middleware
if (nodeEnv === "prod") {
  app.use(
    csrf({
      origin: ["http://localhost:3000", "https://former-client.vercel.app"],
    })
  );
}

app.use(compress({ encoding: "gzip" }));

// Added Security
if (nodeEnv === "prod") {
  app.use(
    "*",
    cors({
      origin: ["http://localhost:3000", "https://former-client.vercel.app"],
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "OPTIONS", "PATCH", "DELETE"],
      exposeHeaders: ["Content-Length"],
      maxAge: 86400,
      credentials: true,
    })
  );
}

// Protected Routes Middleware
app.use("*", logRoutes);
app.use("/api/form/builder/*", protectRoute);
app.use("/api/form/analytics/*", protectRoute);

// Routes≤
app.route("/api", generalRoutes);
app.route("/api", authRoute);
app.route("/api", formRoute);

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    customLogger.info(`Server is running on http://localhost:${info.port}`);
  }
);
