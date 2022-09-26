import { Controller, ViewController } from "@valkyr/react";

import { CreateRealmForm } from "./CreateRealm.Form";

class CreateRealmController extends Controller<State> {
  static readonly state: Partial<State> = {
    errors: {}
  };

  async resolve() {
    this.setState(
      "form",
      new CreateRealmForm({
        name: "",
        color: ""
      }).onError(this.setNext("errors"))
    );
  }
}

type State = {
  form: CreateRealmForm;
  errors: CreateRealmForm["errors"];
};

export const controller = new ViewController(CreateRealmController);
