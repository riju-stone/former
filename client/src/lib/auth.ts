import { db } from "@/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
	secret: process.env.NEXT_PUBLIC_BETTER_AUTH_SECRET!,
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		github: {
			clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
			clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET!,
		},
		google: {
			clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
			clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
		},
	},
});
