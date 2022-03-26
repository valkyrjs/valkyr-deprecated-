import type { Todo } from "../Todo";
import { Member } from "../Workspace";

export type TodoItem = {
  id: string;
  todoId: Todo["id"];
  isDone: boolean;
  data: string;
  assignedTo: Member["id"];
  createdBy: Member["id"];
  createdAt: number;
  updatedAt: number;
  completedAt: number;
};
