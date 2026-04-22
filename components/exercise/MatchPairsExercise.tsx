"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { seededShuffle } from "@/lib/exercise/shuffle";
import { matchPairsDataSchema, type MatchPairsAnswer } from "@/lib/exercise/types";
import type { Exercise } from "@/lib/exercise/types";
import { cn } from "@/lib/utils";

type Props = {
  exercise: Exercise;
  onSubmit: (answer: MatchPairsAnswer) => void;
  disabled?: boolean;
};

export function MatchPairsExercise({ exercise, onSubmit, disabled }: Props) {
  const parsed = matchPairsDataSchema.safeParse(exercise.data);

  const initialRight = useMemo(() => {
    if (!parsed.success) return [];
    const rights = parsed.data.pairs.map((p) => p.right);
    return seededShuffle(rights, exercise.id);
  }, [parsed.success, exercise.id]);

  const [rightOrder, setRightOrder] = useState<string[]>(initialRight);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (!parsed.success) {
    return <p className="text-sm text-destructive">Exercice d&apos;association corrompu.</p>;
  }

  const lefts = parsed.data.pairs.map((p) => p.left);

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setRightOrder((prev) => {
      const oldIdx = prev.indexOf(active.id as string);
      const newIdx = prev.indexOf(over.id as string);
      if (oldIdx === -1 || newIdx === -1) return prev;
      return arrayMove(prev, oldIdx, newIdx);
    });
  }

  function submit() {
    const matches = lefts.map((left, i) => ({ left, right: rightOrder[i] ?? "" }));
    onSubmit({ matches });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-[1fr_auto_1fr] gap-3">
        <ul className="flex flex-col gap-2">
          {lefts.map((left, i) => (
            <li
              key={left}
              className="rounded-md border bg-muted/30 px-3 py-2 text-sm"
              aria-label={`Item ${i + 1} à associer`}
            >
              {left}
            </li>
          ))}
        </ul>
        <div className="flex flex-col items-center justify-around text-muted-foreground">
          {lefts.map((_, i) => (
            <span key={i} aria-hidden="true">↔</span>
          ))}
        </div>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={rightOrder} strategy={verticalListSortingStrategy}>
            <ul className="flex flex-col gap-2">
              {rightOrder.map((right) => (
                <RightItem key={right} id={right} disabled={disabled} />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Réordonne la colonne de droite pour associer chaque paire</span>
        <Button size="sm" type="button" disabled={disabled} onClick={submit}>
          Valider
        </Button>
      </div>
    </div>
  );
}

function RightItem({ id, disabled }: { id: string; disabled?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled,
  });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm",
        isDragging && "shadow-md ring-2 ring-primary/30"
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-muted-foreground hover:text-foreground disabled:opacity-50"
        disabled={disabled}
        type="button"
        aria-label={`Déplacer ${id}`}
      >
        <GripVertical className="size-4" />
      </button>
      <span className="flex-1">{id}</span>
    </li>
  );
}
