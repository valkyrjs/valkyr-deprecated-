import { ForbiddenException } from "@nestjs/common";
import { Validate, Validator } from "@valkyr/nestjs";
import { TodoStore } from "stores";

import { WorkspaceAccess } from "../Access";

@Validator()
export class TodoValidator {
  constructor(private readonly access: WorkspaceAccess) {}

  @Validate("TodoCreated")
  public async onTodoCreated(event: TodoStore.Created) {
    const permission = await this.access.for("todo").can(event.meta.auditor, "create");
    if (permission.granted === false) {
      throw new ForbiddenException("Todo Violation: Member does not have required permission to create todo lists");
    }
  }

  @Validate("TodoItemAdded")
  public async onTodoItemAdded(event: TodoStore.ItemAdded) {
    const permission = await this.access.for("todo").can(event.meta.auditor, "addItem");
    if (permission.granted === false) {
      throw new ForbiddenException("Todo Violation: Member does not have required permission to add todo items");
    }
  }
}
