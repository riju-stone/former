import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";
import { env } from "@/env";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL as string,
  fetchOptions: {
    onError(e) {
      if (e.error.status === 429) {
        toast.error("Too many requests. Please try again later.", { id: "auth" });
      } else {
        toast.error("Something went wrong. Please try again.", { id: "auth" });
      }
    },
  },
});

export const { signIn, signUp, signOut, useSession, accountInfo } = authClient;
