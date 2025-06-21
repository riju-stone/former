import { createAuthClient } from "better-auth/client";
import { oneTapClient } from "better-auth/client/plugins"
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL as string,
  plugins: [
    oneTapClient({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      promptOptions: {
        maxAttempts: 1
      }
    })
  ]
})