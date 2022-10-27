import { Controller, ViewController } from "@valkyr/react";

import { User } from "../models/user.entity";

class DatabaseTemplateController extends Controller<State> {
  async onInit() {
    return {
      users: await this.query(User, {}, "users")
    };
  }
}

type State = {
  users: User[];
};

export const controller = new ViewController(DatabaseTemplateController);
