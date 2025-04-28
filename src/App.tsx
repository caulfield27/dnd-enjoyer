import "./App.css";
import { Button, Input, makeStyles } from "@fluentui/react-components";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { useEffect, useRef, useState } from "react";
import { ITasks, StatusType } from "./types";
import { filterTasks, removeTask } from "./utils/filters";
import { DeleteDroppable, Droppable } from "./components/Droppable";
import { Draggble } from "./components/Draggable";
import { TaskItem } from "./components/TaskItem";
import { Sortable } from "./components/Sortable";

const useStyles = makeStyles({
  btn: {
    outline: "none",
  },
  container: {
    margin: "50px",
    "@media (max-width: 425px)": {
      margin: "24px",
    },
  },
  grid_container: {
    width: "100%",
    padding: "50px 0",
    display: "grid",
    gridTemplateColumns: "repeat(2,50%)",
    gridTemplateRows: "repeat(2,1fr)",
    justifyContent: "center",
    gap: "20px",
    "@media (max-width: 425px)": {
      display: "flex",
      flexDirection: "column",
      padding: "20px 0",
    },
  },
  add_task_container: {
    display: "flex",
    flexDirection: "row",
    gap: "10px",
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
});

function App() {
  const styles = useStyles();
  const blocks: StatusType[] = ["inprogress", "done", "important", "sortable"];
  const storageTasks = localStorage.getItem("tasks");
  const [tasks, setTasks] = useState<ITasks[]>(storageTasks ? JSON.parse(storageTasks) : []);
  const [value, setValue] = useState("");
  const taskRef = useRef<ITasks[] | null>(null);
  const [draggedTask, setDraggedTask] = useState<ITasks | null>(null);

  useEffect(() => {
    taskRef.current = tasks;
  }, [tasks]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem("tasks", JSON.stringify(taskRef.current));
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <DndContext
      onDragStart={(event: DragStartEvent) => {
        const task = tasks.find((task) => task.id === event.active.id);
        if (task) {
          setDraggedTask(task);
        }
      }}
      onDragEnd={(event: DragEndEvent) => {
        setDraggedTask(null);
        if (event.over?.id === "sortable") return;
        const { active, over } = event;
        if (over?.id && blocks.includes(over.id as StatusType)) {
          setTasks(filterTasks(active.id, tasks, over.id));
        } else {
          if (over?.id === "delete") {
            setTasks(removeTask(active.id, tasks));
          }
        }
      }}
    >
      <DeleteDroppable />
      <div className={styles.container}>
        <div className={styles.add_task_container}>
          <Input
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
            placeholder="Добавить задачу"
          />
          <Button
            disabled={!value}
            onClick={() => {
              setValue("");
              setTasks((prev) => [
                ...prev,
                {
                  id: Date.now(),
                  subject: value,
                  status: "inprogress",
                },
              ]);
            }}
            appearance="primary"
          >
            Добавить
          </Button>
        </div>
        <div className={styles.grid_container}>
          {blocks.map((status) => {
            const currentTasks = tasks.filter((task) => task.status === status);
            return draggedTask?.status === status ? (
              <div key={status}>
                <header className={styles.block_header}>{status}</header>
                <div className={styles.task_list_container}>
                  {currentTasks.map((task) => {
                    return <Draggble key={task.id} id={task.id} subject={task.subject} />;
                  })}
                </div>
              </div>
            ) : status === "sortable" ? (
              <Sortable setData={setTasks} key={status} id={status} data={tasks} />
            ) : (
              <Droppable key={status} id={status}>
                <div>
                  <header className={styles.block_header}>{status}</header>
                  <div className={styles.task_list_container}>
                    {currentTasks.map((task) => {
                      return <Draggble key={task.id} id={task.id} subject={task.subject} />;
                    })}
                  </div>
                </div>
              </Droppable>
            );
          })}
        </div>
      </div>
      <DragOverlay>{draggedTask ? <TaskItem subject={draggedTask.subject} /> : null}</DragOverlay>
    </DndContext>
  );
}

export default App;
