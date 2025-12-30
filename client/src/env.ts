// Environment variables
export const env = {
  NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV || "dev",
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:8000/api/auth",
  NEXT_PUBLIC_BETTER_AUTH_SECRET: process.env.NEXT_PUBLIC_BETTER_AUTH_SECRET || "undefined",
  NEXT_PUBLIC_DATABASE_URL: process.env.NEXT_PUBLIC_DATABASE_URL || "http://localhost:8000/api/auth",
  NEXT_PUBLIC_UPSTASH_REDIS_REST_URL: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL || "http://localhost:8000/api/auth",
  NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN || "undefined",
  NEXT_PUBLIC_GITHUB_CLIENT_ID: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || "undefined",
  NEXT_PUBLIC_GITHUB_CLIENT_SECRET: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET || "undefined",
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "undefined",
  NEXT_PUBLIC_GOOGLE_CLIENT_SECRET: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || "undefined",
  NEXT_PUBLIC_RESEND_API_KEY: process.env.NEXT_PUBLIC_RESEND_API_KEY || "undefined",
};