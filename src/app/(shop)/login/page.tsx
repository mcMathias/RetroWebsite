import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/helpers";
import { LoginForm } from "@/features/auth/components";

export const metadata: Metadata = {
  title: "Log ind",
  description: "Log ind på din RetroShop-konto",
};

/**
 * Login page.
 * Redirects authenticated users to home.
 */
export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/");
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}
