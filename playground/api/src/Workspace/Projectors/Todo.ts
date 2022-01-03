import { On, Projector } from "@valkyr/nestjs";
import { TodoStore } from "stores";

import { WorkspaceAccess } from "../Access";
import { TodoService } from "../Services/Todo";

@Projector()
export class TodoProjector {
  constructor(private readonly todo: TodoService, private readonly _: WorkspaceAccess) {}

  @On("TodoCreated")
  public async created({ streamId, data: { workspaceId } }: TodoStore.Created) {
    await this.todo.set({
      id: streamId,
      workspaceId
    });
  }
}
