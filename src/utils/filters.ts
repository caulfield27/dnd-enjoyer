import { UniqueIdentifier } from "@dnd-kit/core";
import { ITasks } from "../types";

export const filterTasks = (id: UniqueIdentifier, tasks: ITasks[], status: UniqueIdentifier) => {
  return tasks.map((task) => (task.id === id ? { ...task, status } : task));
};

export const removeTask = (id: UniqueIdentifier, tasks: ITasks[]) =>
  tasks.filter((task) => task.id !== id);
