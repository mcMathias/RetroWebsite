import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/helpers";
import { RegisterForm } from "@/features/auth/components";

export const metadata: Metadata = {
  title: "Opret konto",
  description: "Opret en konto hos RetroShop",
};

/**
 * Register page.
 * Redirects authenticated users to home.
 */
export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/");
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <RegisterForm />
    </div>
  );
}
