"use client";

import { Loader2, NotebookPen, Save } from "lucide-react";
import { useState, useTransition } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { saveNote } from "@/app/(app)/subjects/[slug]/[topic]/note-actions";

type Props = {
  topicId: string;
  slug: string;
  initialContent: string;
  initialUpdatedAt: string | null;
};

export function NotesCard({
  topicId,
  slug,
  initialContent,
  initialUpdatedAt,
}: Props) {
  const [content, setContent] = useState(initialContent);
  const [updatedAt, setUpdatedAt] = useState<string | null>(initialUpdatedAt);
  const [pending, startTransition] = useTransition();
  const [dirty, setDirty] = useState(false);

  function handleSave() {
    startTransition(async () => {
      const result = await saveNote({
        topic_id: topicId,
        slug,
        content_md: content,
      });
      if (result.ok) {
        setUpdatedAt(result.updated_at);
        setDirty(false);
        toast.success("Notes enregistrées.");
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-2 space-y-0">
        <NotebookPen className="mt-0.5 size-4 text-muted-foreground" />
        <div className="flex-1">
          <CardTitle>Mes notes</CardTitle>
          <CardDescription>
            Markdown supporté (titres, listes, **gras**, <em>italique</em>, $LaTeX$).
            Persistées sur ton compte.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="edit" className="flex flex-col gap-3">
          <TabsList className="self-start">
            <TabsTrigger value="edit">Édition</TabsTrigger>
            <TabsTrigger value="preview">Aperçu</TabsTrigger>
          </TabsList>
          <TabsContent value="edit">
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setDirty(true);
              }}
              placeholder="Tes notes sur ce topic…&#10;&#10;Formules-clés, questions à poser, erreurs courantes, ton résumé."
              className="min-h-[220px] w-full resize-y rounded-md border bg-background px-3 py-2 font-mono text-sm leading-6 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </TabsContent>
          <TabsContent value="preview">
            {content.trim() ? (
              <div className="prose-sm min-h-[120px] max-w-none text-sm leading-7 [&_h1]:mt-2 [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:mt-4 [&_h2]:text-base [&_h2]:font-semibold [&_li]:mb-1 [&_p]:mb-3 [&_strong]:font-semibold [&_ul]:ml-5 [&_ul]:list-disc">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm italic text-muted-foreground">
                Rien à prévisualiser pour le moment.
              </p>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">
            {dirty
              ? "Modifications non enregistrées."
              : updatedAt
                ? `Dernière sauvegarde : ${formatDate(updatedAt)}`
                : "Pas encore de note enregistrée."}
          </span>
          <Button
            onClick={handleSave}
            disabled={pending || !dirty}
            size="sm"
          >
            {pending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Enregistrement…
              </>
            ) : (
              <>
                <Save className="mr-2 size-4" />
                Enregistrer
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(d);
}
