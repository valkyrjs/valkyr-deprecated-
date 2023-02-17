import { Form } from "@valkyr/react";
import Joi from "joi";

import { db } from "../Data/Event.Database";

export class EventGroupForm extends Form<{
  name: string;
}> {
  readonly schema = Joi.object({
    name: Joi.string().required()
  });

  static async submit(form: EventGroupForm): Promise<void> {
    await db.collection("groups").insertOne({ name: form.get("name") });
  }
}
