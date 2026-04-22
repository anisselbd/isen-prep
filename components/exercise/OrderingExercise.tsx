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
import { orderingDataSchema, type OrderingAnswer } from "@/lib/exercise/types";
import type { Exercise } from "@/lib/exercise/types";
import { cn } from "@/lib/utils";

type Props = {
  exercise: Exercise;
  onSubmit: (answer: OrderingAnswer) => void;
  disabled?: boolean;
};

export function OrderingExercise({ exercise, onSubmit, disabled }: Props) {
  const parsed = orderingDataSchema.safeParse(exercise.data);

  const initialOrder = useMemo(() => {
    if (!parsed.success) return [];
    return seededShuffle(parsed.data.items, exercise.id);
  }, [parsed.success, exercise.id]);

  const [order, setOrder] = useState<string[]>(initialOrder);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (!parsed.success) {
    return <p className="text-sm text-destructive">Exercice d&apos;ordre corrompu.</p>;
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setOrder((prev) => {
      const oldIdx = prev.indexOf(active.id as string);
      const newIdx = prev.indexOf(over.id as string);
      if (oldIdx === -1 || newIdx === -1) return prev;
      return arrayMove(prev, oldIdx, newIdx);
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          <ul className="flex flex-col gap-2">
            {order.map((item, i) => (
              <SortableItem key={item} id={item} index={i} disabled={disabled} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Glisse ou utilise le clavier (Tab + Espace + flèches)</span>
        <Button size="sm" type="button" disabled={disabled} onClick={() => onSubmit({ order })}>
          Valider
        </Button>
      </div>
    </div>
  );
}

function SortableItem({ id, index, disabled }: { id: string; index: number; disabled?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 rounded-md border bg-background px-3 py-2 text-sm",
        isDragging && "shadow-md ring-2 ring-primary/30"
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-muted-foreground hover:text-foreground disabled:opacity-50"
        disabled={disabled}
        aria-label={`Déplacer ${id}`}
        type="button"
      >
        <GripVertical className="size-4" />
      </button>
      <span className="font-mono text-xs text-muted-foreground">{index + 1}.</span>
      <span className="flex-1">{id}</span>
    </li>
  );
}
