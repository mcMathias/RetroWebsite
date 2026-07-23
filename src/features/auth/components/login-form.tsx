"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { loginAction } from "@/features/auth/actions";

/**
 * Login form component.
 * Handles email/password authentication via server action.
 */
export function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    startTransition(async () => {
      const result = await loginAction(data);
      if (result.success) {
        router.push(result.data.redirectTo);
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Log ind</CardTitle>
        <p className="text-sm text-muted-foreground">
          Log ind på din RetroShop-konto
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Adgangskode</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              minLength={8}
              autoComplete="current-password"
              disabled={isPending}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Log ind
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Har du ikke en konto?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Opret konto
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
