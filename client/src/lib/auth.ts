import { db } from "@/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
	secret: process.env.NEXT_PUBLIC_BETTER_AUTH_SECRET as string,
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	socialProviders: {
		github: {
			clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID as string,
			clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET as string,
		},
		google: {
			prompt: "select_account",
			clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
		},
	},
	plugins: [
		nextCookies()
	]
});
