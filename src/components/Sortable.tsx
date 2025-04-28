import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { ITasks, StatusType } from "../types";
import { makeStyles } from "@fluentui/react-components";
import { TaskItem } from "./TaskItem";
import { Dispatch, SetStateAction, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { relocate } from "../utils/swap";

const useStyles = makeStyles({
  container: {
    position: "relative",
  },
  img: {
    position: "absolute",
    top: "75%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    width: "50px",
  },
  block_header: {
    padding: "10px",
    borderBottom: "1px solid grey",
  },
  task_list_container: {
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  droppable_container: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
});

interface SortableProps {
  id: StatusType | number;
  data: ITasks[];
  setData: Dispatch<SetStateAction<ITasks[]>>;
}

const SortableDroppable = ({ id }: { id: number }) => {
  const { isOver, setNodeRef } = useDroppable({ id });
  const style = {
    border: isOver ? "1px solid blue" : "none",
    width: "100%",
    height: "36px",
    borderRadius: "8px",
  };

  return <div ref={setNodeRef} style={style}></div>;
};

const SortableDraggble = ({ id, subject }: { id: number; subject: string }) => {
  const { attributes, transform, listeners, setNodeRef } = useDraggable({ id });

  const styles = transform
    ? {
        transform: CSS.Transform.toString(transform),
        visibility: "hidden" as const,
      }
    : {};

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={styles}>
      <TaskItem subject={subject} />
    </div>
  );
};

export const Sortable = ({ id, data, setData }: SortableProps) => {
  const styles = useStyles();
  const { isOver, setNodeRef } = useDroppable({ id });
  const [draggedTask, setDraggedTask] = useState<{
    task: ITasks;
    index: number;
  } | null>(null);
  return (
    <div className={styles.container} ref={setNodeRef}>
      <DndContext
        onDragStart={(event: DragStartEvent) => {
          let ind = 0;
          const foundTask = data.find((task, i) => {
            ind = i;
            return task.id === event.active.id;
          });
          if (foundTask) {
            const chosenTask = {
              task: foundTask,
              index: ind,
            };
            setDraggedTask(chosenTask);
          }
        }}
        onDragEnd={(event: DragEndEvent) => {
          let ind;
          for (let i = 0; i < data.length; i++) {
            if (data[i].id === event.over?.id) {
              ind = i;
              break;
            }
          }
          
          if (ind !== undefined && draggedTask?.index !== undefined) { 
            relocate(draggedTask.index, ind, data, setData);
          }
          setDraggedTask(null);
        }}
      >
        <div>
          <header className={styles.block_header}>{id}</header>
          <div className={styles.task_list_container}>
            {data.map((task, i) => {
              return (
                <div key={task.id} className={styles.droppable_container}>
                  {draggedTask?.index !== undefined && draggedTask.index > i ? (
                    <SortableDroppable id={task.id} />
                  ) : null}
                  <SortableDraggble id={task.id} subject={task.subject} />
                  {draggedTask?.index !== undefined && draggedTask.index < i ? (
                    <SortableDroppable id={task.id} />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
        <DragOverlay>{draggedTask && <TaskItem subject={draggedTask.task.subject} />}</DragOverlay>
      </DndContext>
      {isOver && <img className={styles.img} alt="ban logo" src="/Ban_logo.svg" />}
    </div>
  );
};
