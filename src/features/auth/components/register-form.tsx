"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { registerAction } from "@/features/auth/actions";

/**
 * Register form component.
 * Creates a new customer account via server action.
 */
export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    startTransition(async () => {
      const result = await registerAction(data);
      if (result.success) {
        router.push(result.data.redirectTo);
        router.refresh();
      } else {
        setError(result.error);
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
      }
    });
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Opret konto</CardTitle>
        <p className="text-sm text-muted-foreground">
          Opret en konto for at handle hos RetroShop
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Navn</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Dit navn"
              required
              minLength={2}
              autoComplete="name"
              disabled={isPending}
            />
            {fieldErrors.name && (
              <p className="text-xs text-destructive">{fieldErrors.name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="din@email.dk"
              required
              autoComplete="email"
              disabled={isPending}
            />
            {fieldErrors.email && (
              <p className="text-xs text-destructive">{fieldErrors.email[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Adgangskode</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Min. 8 tegn"
              required
              minLength={8}
              autoComplete="new-password"
              disabled={isPending}
            />
            {fieldErrors.password && (
              <p className="text-xs text-destructive">
                {fieldErrors.password[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Bekræft adgangskode</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Gentag adgangskode"
              required
              minLength={8}
              autoComplete="new-password"
              disabled={isPending}
            />
            {fieldErrors.confirmPassword && (
              <p className="text-xs text-destructive">
                {fieldErrors.confirmPassword[0]}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Opret konto
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Har du allerede en konto?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Log ind
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
