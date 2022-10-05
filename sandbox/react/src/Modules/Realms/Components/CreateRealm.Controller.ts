import { Controller, ViewController } from "@valkyr/react";

import { CreateRealmForm } from "./CreateRealm.Form";

class CreateRealmController extends Controller<State> {
  async onResolve() {
    return {
      form: new CreateRealmForm({ name: "", color: "" }).onError(this.setNext("errors")),
      errors: {}
    };
  }
}

type State = {
  form: CreateRealmForm;
  errors: CreateRealmForm["errors"];
};

export const controller = new ViewController(CreateRealmController);
