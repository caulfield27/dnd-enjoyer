import { UniqueIdentifier } from "@dnd-kit/core";

export interface Props {
    id: StatusType | number;
    children: React.ReactNode;
}

export type StatusType = "inprogress" | "done" | "important" | "sortable";

export interface ITasks {
  id: number;
  subject: string;
  status: StatusType | UniqueIdentifier;
}

