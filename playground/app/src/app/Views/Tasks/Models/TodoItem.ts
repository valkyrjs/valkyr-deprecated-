import { Document, Model } from "@valkyr/db";

export type TodoItemDocument = Document & {
  todoId: string;
  text: string;
  sort?: number;
  assignedTo?: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
};

export class TodoItem extends Model<TodoItemDocument> {
  readonly todoId!: TodoItemDocument["todoId"];
  readonly text!: TodoItemDocument["text"];
  readonly sort?: TodoItemDocument["sort"];
  readonly assignedTo: TodoItemDocument["assignedTo"];
  readonly createdBy!: TodoItemDocument["createdBy"];
  readonly createdAt!: TodoItemDocument["createdAt"];
  readonly updatedAt?: TodoItemDocument["updatedAt"];
  readonly completedAt?: TodoItemDocument["completedAt"];
}

export type TodoItemModel = typeof TodoItem;
