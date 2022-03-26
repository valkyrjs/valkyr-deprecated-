import type { Todo } from "../Todo";
import type { WorkspaceMember } from "../Workspace";

export type TodoItem = {
  id: string;
  todoId: Todo["id"];
  isDone: boolean;
  data: string;
  assignedTo: WorkspaceMember["id"];
  createdBy: WorkspaceMember["id"];
  createdAt: number;
  updatedAt: number;
  completedAt: number;
};
