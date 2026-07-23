import NextAuth from "next-auth";
import { authConfig } from "./config";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { verifyPassword } from "./password";
import { loginSchema } from "@/lib/validation/auth";

/**
 * Full Auth.js instance (server-only).
 *
 * This extends the edge-safe base config with:
 * - Prisma adapter (requires Node.js)
 * - Credentials provider with password verification (requires Node.js crypto)
 *
 * Use `auth` for server-side session access in Server Components/Actions.
 * Use `handlers` for the API route.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await db.user.findUnique({
          where: { email: parsed.data.email },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
            role: true,
            image: true,
          },
        });

        if (!user || !user.password) return null;

        const isValid = await verifyPassword(
          parsed.data.password,
          user.password,
        );
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
});
