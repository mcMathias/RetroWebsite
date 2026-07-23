import type { NextAuthConfig } from "next-auth";
import type { UserRole } from "@prisma/client";

/**
 * Edge-safe Auth.js configuration.
 *
 * This config contains ONLY edge-compatible code:
 * - No Prisma (Node.js only)
 * - No crypto/scrypt (Node.js only)
 * - No database calls
 *
 * The Credentials provider and Prisma adapter are added
 * in the full server config (./index.ts).
 *
 * This config is used by the middleware for JWT validation
 * and the `authorized` callback for route protection.
 */
export const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [], // Populated in full config (./index.ts)
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: UserRole }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    async authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;

      // Protect /admin routes
      if (pathname.startsWith("/admin")) {
        if (!isLoggedIn) return false;
        const role = auth.user.role as UserRole;
        return role === "ADMIN" || role === "EMPLOYEE";
      }

      return true;
    },
  },
};

