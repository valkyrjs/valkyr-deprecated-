import { On, Projector } from "@valkyr/angular";
import { LedgerEventRecord } from "@valkyr/ledger";
import { TodoStore } from "stores";

import { Todo } from "./Models/Todo";

export class TodoProjector extends Projector {
  @On("TodoCreated")
  public async handleTodoCreated({ streamId, data: { workspaceId, name } }: LedgerEventRecord<TodoStore.Created>) {
    await Todo.insertOne({
      id: streamId,
      workspaceId,
      name
    });
  }

  @On("TodoSortSet")
  public async handleTodoSortSet({ streamId, data: { sort } }: LedgerEventRecord<TodoStore.SortSet>) {
    await Todo.updateOne({ id: streamId }, { $set: { sort } });
  }
}
