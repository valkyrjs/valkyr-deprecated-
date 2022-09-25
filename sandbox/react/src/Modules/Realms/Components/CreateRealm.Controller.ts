import { Controller, ViewController } from "@valkyr/react";

import { CreateRealmForm } from "./CreateRealm.Form";

class CreateRealmController extends Controller<State> {
  static readonly state: State = {
    form: new CreateRealmForm({
      name: "",
      color: "#fff"
    })
  };

  async resolve() {
    // ...
  }
}

type State = {
  form: CreateRealmForm;
};

export const controller = new ViewController(CreateRealmController);
