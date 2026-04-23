"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfileAction, type UpdateProfileState } from "./actions";

const initial: UpdateProfileState = { status: "idle" };

export function ProfileForm({
  displayName,
  targetDate,
}: {
  displayName: string | null;
  targetDate: string | null;
}) {
  const [state, formAction, pending] = useActionState(updateProfileAction, initial);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="display_name">Nom affiché</Label>
        <Input
          id="display_name"
          name="display_name"
          defaultValue={displayName ?? ""}
          placeholder="ex: Anisse"
          maxLength={80}
          className="max-w-sm"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="target_interview_date">Date de l&apos;entretien</Label>
        <Input
          id="target_interview_date"
          name="target_interview_date"
          type="date"
          defaultValue={targetDate ?? ""}
          className="max-w-sm"
        />
        <p className="text-xs text-muted-foreground">
          Utilisée pour le countdown du dashboard. Laisse vide si la date n&apos;est pas encore fixée.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Enregistrement…" : "Enregistrer"}
        </Button>
        {state.status === "ok" ? (
          <span className="text-sm text-emerald-600">Enregistré ✓</span>
        ) : null}
        {state.status === "error" ? (
          <span className="text-sm text-destructive">{state.message}</span>
        ) : null}
      </div>
    </form>
  );
}
