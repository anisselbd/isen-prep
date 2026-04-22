"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginWithMagicLink, type LoginState } from "./actions";

const initialState: LoginState = { status: "idle" };

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(
    loginWithMagicLink,
    initialState
  );

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>ISEN PREP</CardTitle>
        <CardDescription>
          Entre ton email pour recevoir un lien de connexion.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="toi@exemple.com"
              required
              disabled={pending || state.status === "success"}
            />
          </div>
          {next ? <input type="hidden" name="next" value={next} /> : null}
          <Button type="submit" disabled={pending || state.status === "success"}>
            {pending ? "Envoi en cours…" : "Recevoir le lien"}
          </Button>
          {state.status === "error" ? (
            <p role="alert" className="text-sm text-destructive">
              {state.message}
            </p>
          ) : null}
          {state.status === "success" ? (
            <p className="text-sm text-muted-foreground">
              Lien envoyé à <span className="font-medium">{state.email}</span>.
              Vérifie ta boîte mail.
            </p>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
