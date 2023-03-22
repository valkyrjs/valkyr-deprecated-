import { nanoid } from "@valkyr/ledger";
import { ControllerForm } from "@valkyr/solid";
import Joi from "joi";

import { auth } from "~Services/Auth";
import { eventStore } from "~Services/Ledger/EventStore";

import { workspaceCreated } from "../Events";

export class WorkspaceForm extends ControllerForm<{
  name: string;
  user: string;
}> {
  readonly schema = Joi.object({
    name: Joi.string().required(),
    user: Joi.string().required()
  });

  static async submit(form: WorkspaceForm): Promise<string | void> {
    const workspaceId = nanoid();
    await eventStore.push(
      workspaceId,
      workspaceId,
      workspaceCreated(
        {
          name: form.get("name"),
          user: {
            name: form.get("user")
          }
        },
        auth.auditor
      )
    );
  }
}
