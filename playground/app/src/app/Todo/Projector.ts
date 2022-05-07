import { EventProjector, On, Projector } from "@valkyr/angular";
import { TodoStore } from "stores";

import { Todo } from "./Models/Todo";

@Projector()
export class TodoProjector extends EventProjector {
  @On("TodoCreated")
  public async handleTodoCreated({ streamId, data: { workspaceId, name } }: TodoStore.Created) {
    await Todo.insertOne({
      id: streamId,
      workspaceId,
      name
    });
  }
}
