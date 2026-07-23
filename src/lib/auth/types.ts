import type { UserRole } from "@prisma/client";
import type { DefaultSession } from "next-auth";

/**
 * Extend Auth.js types to include our custom user fields.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    role?: UserRole;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
  }
}
