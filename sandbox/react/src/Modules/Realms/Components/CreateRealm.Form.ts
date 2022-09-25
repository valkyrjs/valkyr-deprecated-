import { Form, Joi } from "@valkyr/react";

import { Realm } from "../Models/Realm";

export class CreateRealmForm extends Form<{
  name: string;
  color: string;
}> {
  readonly schema = Joi.object({
    name: Joi.string().required(),
    color: Joi.string().required()
  });

  async handleSubmit() {
    Realm.insertOne({
      name: this.get("name"),
      color: this.get("color"),
      icon: "",
      members: [],
      invites: [],
      owner: ""
    });
    this.clear();
  }
}
