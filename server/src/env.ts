import { configDotenv } from "dotenv";
configDotenv();

export const env = {
  PORT: parseInt(process.env.PORT as string) || 8000,
  APP_URL: process.env.APP_URL || "http://localhost:3000",
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || "http://localhost:8000/api/auth",
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || "undefined",
  POSTGRES_URL: process.env.POSTGRES_URL || "undefined",
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || "undefined",
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || "undefined",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "undefined",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "undefined",
  RESEND_API_KEY: process.env.RESEND_API_KEY || "undefined",
};