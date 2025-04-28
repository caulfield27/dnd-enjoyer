import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { TaskItem } from "./TaskItem";

export const Draggble = ({ id, subject }: { id: number; subject: string }) => {
  const { attributes, listeners, transform, setNodeRef } = useDraggable({ id });
  const style = transform
    ? {
        transform: CSS.Transform.toString(transform),
        visibility: "hidden" as const
      }
    : {};
  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={{...style, touchAction: "none"}}>
      <TaskItem subject={subject} />
    </div>
  );
};
