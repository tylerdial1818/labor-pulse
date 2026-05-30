import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [
    // TODO: Add client-approved identity providers here, such as Auth0, Okta, Entra ID, or Google Workspace.
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    authorized({ auth }) {
      return Boolean(auth?.user);
    }
  }
} satisfies NextAuthConfig;
