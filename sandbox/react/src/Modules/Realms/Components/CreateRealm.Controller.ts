import { Controller, ViewController } from "@valkyr/react";

import { CreateRealmForm } from "./CreateRealm.Form";

class CreateRealmController extends Controller<State> {
  async onInit() {
    return {
      form: new CreateRealmForm({ name: "", color: "" }).onError(this.setState("errors")),
      errors: {}
    };
  }
}

type State = {
  form: CreateRealmForm;
  errors: CreateRealmForm["errors"];
};

export const controller = new ViewController(CreateRealmController);
