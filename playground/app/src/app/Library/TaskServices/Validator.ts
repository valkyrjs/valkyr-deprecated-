import { EventValidator, Validate, Validator } from "@valkyr/angular";
import { TodoStore } from "stores";

@Validator()
export class TodoValidator extends EventValidator {
  @Validate("TodoCreated")
  public async onTodoCreated(_: TodoStore.Created) {
    // throw new Error("Todo Violation: Member does not have required permission to create todo lists");
  }

  @Validate("TodoItemAdded")
  public async onTodoItemAdded(_: TodoStore.ItemAdded) {
    // throw new Error("Todo Violation: Member does not have required permission to add todo items");
  }
}
