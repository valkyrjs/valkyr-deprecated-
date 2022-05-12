import { Document, Model } from "@valkyr/db";

export type TodoDocument = Document & {
  workspaceId: string;
  name: string;
  sort?: number;
};

export class Todo extends Model<TodoDocument> {
  readonly workspaceId!: TodoDocument["workspaceId"];
  readonly name!: TodoDocument["name"];
  readonly sort?: TodoDocument["sort"];
}

export type TodoModel = typeof Todo;
