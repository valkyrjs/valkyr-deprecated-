import { Controller } from "@valkyr/react";
import { ChangeEvent } from "react";

import { db } from "~services/database";

import { User } from "../models/user.entity";
import { getFakeUserData } from "../utils/user.utils";

let page = 1;

export class UsersController extends Controller<{
  users: User[];
  page: number;
}> {
  async onInit() {
    return {
      users: await this.query(db.collection("users"), {}, "users"),
      page
    };
  }

  addUsers(count = 1) {
    const users = [];
    for (let i = 0; i < count; i++) {
      users.push(getFakeUserData());
    }
    db.collection("users").insertMany(users);
  }

  async search({ target: { value } }: ChangeEvent<HTMLInputElement>) {
    this.setState(
      "users",
      await this.query(
        db.collection("users"),
        {
          where:
            value === ""
              ? {}
              : {
                  name: { $regex: value, $options: "i" }
                }
        },
        "users"
      )
    );
  }

  async queryRange(from: string, to: string) {
    this.setState("users", await this.query(db.collection("users"), { range: { from, to } }, "users"));
  }

  async queryOffset(value: string, direction: 1 | -1, limit?: number) {
    this.setState("users", await this.query(db.collection("users"), { offset: { value, direction }, limit }, "users"));
  }

  async exportUsers() {
    console.log("export users", await db.export("users"));
  }

  async goToPage(value: number) {
    page = value;
    this.setState("page", page);
  }
}
