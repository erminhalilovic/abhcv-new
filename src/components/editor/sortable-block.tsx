"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";

type SortableBlockProps = {
  id: string;
  onRemove: () => void;
  children: React.ReactNode;
};

export function SortableBlock({ id, onRemove, children }: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex gap-1 items-start">
      <div
        className="flex items-center pt-2 shrink-0"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4 text-muted-foreground cursor-grab" />
      </div>
      <div className="flex-1 border border-border rounded-md p-2 space-y-2 relative group">
        <button
          className="absolute -top-2 -right-2 size-5 rounded-full bg-muted border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-white hover:border-destructive"
          onClick={onRemove}
        >
          <X className="size-3" />
        </button>
        {children}
      </div>
    </div>
  );
}
