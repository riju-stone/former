
import dotenv from "dotenv"
import { betterAuth } from "better-auth"
import { db } from "../db/db.js"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { dot } from "node:test/reporters"   

dotenv.config()

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL!,
    secret: process.env.BETTER_AUTH_SECRET!,
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,

        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    }
})