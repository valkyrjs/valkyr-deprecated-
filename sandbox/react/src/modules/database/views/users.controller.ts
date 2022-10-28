import { Controller, ViewController } from "@valkyr/react";

import { User } from "../models/user.entity";

class UsersController extends Controller<State> {
  async onInit() {
    return {
      users: await this.query(User, {}, "users")
    };
  }

  addUsers(count = 1) {
    for (let i = 0; i < count; i++) {
      User.faker();
    }
  }
}

type State = {
  users: User[];
};

export const controller = new ViewController(UsersController);
