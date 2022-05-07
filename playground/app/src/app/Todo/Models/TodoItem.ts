import { Collection, Document, IndexedDbAdapter, Model } from "@valkyr/db";

type TodoItemDocument = Document & {
  todoId: string;
  text: string;
  assignedTo?: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
};

export class Todo extends Model<TodoItemDocument> {
  public static override readonly $collection = new Collection<TodoItemDocument>("todo-items", new IndexedDbAdapter());

  public readonly todoId!: TodoItemDocument["todoId"];
  public readonly text!: TodoItemDocument["text"];
  public readonly assignedTo: TodoItemDocument["assignedTo"];
  public readonly createdBy!: TodoItemDocument["createdBy"];
  public readonly createdAt!: TodoItemDocument["createdAt"];
  public readonly updatedAt?: TodoItemDocument["updatedAt"];
  public readonly completedAt?: TodoItemDocument["completedAt"];
}
