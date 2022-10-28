import { Controller, ViewController } from "@valkyr/react";

import { db } from "~services/database";

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

  async queryRange(from: string, to: string) {
    this.setState("users", await this.query(User, { range: { from, to } }, "users"));
  }

  async queryOffset(value: string, direction: 1 | -1, limit?: number) {
    this.setState("users", await this.query(User, { offset: { value, direction }, limit }, "users"));
  }

  async exportUsers() {
    console.log("export users", await db.export("users"));
  }
}

type State = {
  users: User[];
};

export const controller = new ViewController(UsersController);
