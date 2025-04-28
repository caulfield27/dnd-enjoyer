import { Dispatch, SetStateAction } from "react";
import { ITasks } from "../types";

export function relocate(
  from: number,
  to: number,
  arr: ITasks[],
  setTasks: Dispatch<SetStateAction<ITasks[]>>
) {
  const newArr: ITasks[] = [...arr];
  newArr.splice(from,1);
  newArr.splice(to,0,arr[from]);
  setTasks(newArr);
}
