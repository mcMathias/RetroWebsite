"use server";

import { signIn } from "@/lib/auth";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { loginSchema, registerSchema } from "@/lib/validation/auth";
import { actionSuccess, actionError, type ActionResult } from "@/lib/errors";
import { AuthError } from "next-auth";

/**
 * Server Action: Sign in with email and password.
 */
export async function loginAction(
  formData: unknown,
): Promise<ActionResult<{ redirectTo: string }>> {
  try {
    const parsed = loginSchema.safeParse(formData);
    if (!parsed.success) {
      return actionError("Invalid email or password");
    }

    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });

    return actionSuccess({ redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return actionError("Invalid email or password");
        default:
          return actionError("Something went wrong. Please try again.");
      }
    }
    // Re-throw redirect errors from Next.js
    throw error;
  }
}

/**
 * Server Action: Register a new customer account.
 */
export async function registerAction(
  formData: unknown,
): Promise<ActionResult<{ redirectTo: string }>> {
  try {
    const parsed = registerSchema.safeParse(formData);
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join(".");
        if (!fieldErrors[path]) fieldErrors[path] = [];
        fieldErrors[path].push(issue.message);
      }
      return actionError("Validation failed", fieldErrors);
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: parsed.data.email },
      select: { id: true },
    });

    if (existingUser) {
      return actionError("An account with this email already exists");
    }

    // Create user
    const hashedPassword = hashPassword(parsed.data.password);
    await db.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: hashedPassword,
        role: "CUSTOMER",
      },
    });

    // Auto sign-in after registration
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });

    return actionSuccess({ redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      return actionError("Account created but sign-in failed. Please log in.");
    }
    // Re-throw redirect errors
    throw error;
  }
}
