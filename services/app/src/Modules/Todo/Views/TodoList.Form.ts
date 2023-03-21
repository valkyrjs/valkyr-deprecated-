import { ControllerForm } from "@valkyr/solid";
import Joi from "joi";

import { auth } from "~Services/Auth";
import { eventStore } from "~Services/Ledger/EventStore";
import { router } from "~Services/Router";

import { todoItemAdded } from "../Events";

export class TodoListForm extends ControllerForm<{
  description: string;
}> {
  readonly schema = Joi.object({
    description: Joi.string().required()
  });

  static async submit(form: TodoListForm): Promise<string | void> {
    const containerId = router.params.get("workspaceId");
    if (containerId === undefined) {
      throw new Error("No valid container id present");
    }
    await eventStore.push(
      containerId,
      crypto.randomUUID(),
      todoItemAdded(
        {
          description: form.get("description")
        },
        auth.auditor
      )
    );
  }
}
