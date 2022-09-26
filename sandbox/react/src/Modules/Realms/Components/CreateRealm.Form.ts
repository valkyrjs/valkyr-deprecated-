import { Form, Joi } from "@valkyr/react";

import { Realm } from "../Models/Realm";

export class CreateRealmForm extends Form<{
  name: string;
  color: string;
}> {
  readonly schema = Joi.object({
    name: Joi.string().min(3).max(10).required(),
    color: Joi.string().required()
  });

  static async submit(form: CreateRealmForm): Promise<void> {
    Realm.insertOne({
      name: form.get("name"),
      color: form.get("color"),
      icon: "",
      members: [],
      invites: [],
      owner: ""
    });
    form.clear();
  }
}
