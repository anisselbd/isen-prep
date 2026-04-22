"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { RotateCw } from "lucide-react";
import { LessonRenderer } from "@/components/lesson/LessonRenderer";
import { cn } from "@/lib/utils";

type Props = {
  front: string;
  back: string;
  /** Called the first time a card is flipped from front→back. */
  onReveal?: () => void;
};

// Parent resets state by passing a new `key` prop when moving to a new card.
export function FlashcardView({ front, back, onReveal }: Props) {
  const [flipped, setFlipped] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipped]);

  function toggle() {
    setFlipped((prev) => {
      if (!prev) onReveal?.();
      return !prev;
    });
  }

  return (
    <div
      className="relative h-64 w-full cursor-pointer select-none [perspective:1200px]"
      onClick={toggle}
      role="button"
      tabIndex={0}
      aria-label={flipped ? "Retourner vers le recto" : "Retourner vers le verso"}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          toggle();
        }
      }}
    >
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }
        }
      >
        <Face side="front" visible={!flipped}>
          <LessonRenderer markdown={front} />
        </Face>
        <Face side="back" visible={flipped}>
          <LessonRenderer markdown={back} />
        </Face>
      </motion.div>
      <div className="pointer-events-none absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-background/80 px-2 py-1 text-[10px] text-muted-foreground backdrop-blur">
        <RotateCw className="size-3" aria-hidden="true" />
        Espace
      </div>
    </div>
  );
}

function Face({
  side,
  visible,
  children,
}: {
  side: "front" | "back";
  visible: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "absolute inset-0 overflow-auto rounded-xl border bg-card p-6 shadow-sm",
        "[backface-visibility:hidden]",
        side === "back" && "[transform:rotateY(180deg)]"
      )}
    >
      {children}
    </div>
  );
}
