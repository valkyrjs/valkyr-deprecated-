import { Document, Model } from "@valkyr/db";

export type TodoDocument = Document & {
  workspaceId: string;
  name: string;
};

export class Todo extends Model<TodoDocument> {
  readonly workspaceId!: TodoDocument["workspaceId"];
  readonly name!: TodoDocument["name"];
}

export type TodoModel = typeof Todo;
