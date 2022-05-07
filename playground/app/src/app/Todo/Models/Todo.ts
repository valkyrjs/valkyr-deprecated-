import { Collection, Document, IndexedDbAdapter, Model } from "@valkyr/db";

type TodoDocument = Document & {
  workspaceId: string;
  name: string;
};

export class Todo extends Model<TodoDocument> {
  public static override readonly $collection = new Collection<TodoDocument>("todos", new IndexedDbAdapter());

  public readonly workspaceId!: TodoDocument["workspaceId"];
  public readonly name!: TodoDocument["name"];
}
