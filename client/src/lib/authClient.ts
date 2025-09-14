import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL as string,
  fetchOptions: {
    onRequest() {
      // You can show a loading indicator here if needed
      toast.loading("Authenticating...", { id: "auth" });
    },
    onError(e) {
      if (e.error.status === 429) {
        toast.error("Too many requests. Please try again later.");
      } else {
        toast.error("Something went wrong. Please try again")
      }
    },
  },
})

export const { signIn, signUp, signOut, useSession } = authClient;