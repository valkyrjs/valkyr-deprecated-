import { faker } from "@faker-js/faker";
import { Controller } from "@valkyr/react";

import { db } from "~services/database";

import { getFakeUserData } from "../utils/user.utils";

export class TestsController extends Controller<State> {
  #email = faker.internet.email();

  async onInit() {
    return {
      tests: []
    };
  }

  async start() {
    if (this.state.tests.length > 0) {
      this.setState("tests", []);
    }

    await this.#testInsertOne();
    await this.#testInsertMany();
    await this.#testUpdateOne();
    await this.#testUpdateMany();
    await this.#testRemove();

    await db.flush();
  }

  async #testInsertOne() {
    try {
      await db.collection("users").insertOne(getFakeUserData());
      this.setState("tests", [
        ...this.state.tests,
        {
          name: "Insert One",
          success: true
        }
      ]);
    } catch (error) {
      this.setState("tests", [
        ...this.state.tests,
        {
          name: "Insert One",
          success: false
        }
      ]);
    }
  }

  async #testInsertMany() {
    try {
      await db.collection("users").insertMany([getFakeUserData(), getFakeUserData(), getFakeUserData()]);
      this.setState("tests", [
        ...this.state.tests,
        {
          name: "Insert Many",
          success: true
        }
      ]);
    } catch (error) {
      this.setState("tests", [
        ...this.state.tests,
        {
          name: "Insert Many",
          success: false
        }
      ]);
    }
  }

  async #testUpdateOne() {
    const user = await db.collection("users").findOne();
    if (user === undefined) {
      return this.setState("tests", [
        ...this.state.tests,
        {
          name: "Update One",
          success: false
        }
      ]);
    }
    try {
      const result = await db.collection("users").updateOne({ id: user.id }, { $set: { email: this.#email } });
      this.setState("tests", [
        ...this.state.tests,
        {
          name: "Update One",
          success: result.matched === 1 && result.modified === 1
        }
      ]);
    } catch (error) {
      this.setState("tests", [
        ...this.state.tests,
        {
          name: "Update One",
          success: false
        }
      ]);
    }
  }

  async #testUpdateMany() {
    try {
      const result = await db.collection("users").updateMany(
        { posts: 0 },
        {
          $inc: {
            posts: 1
          }
        }
      );
      this.setState("tests", [
        ...this.state.tests,
        {
          name: "Update Many",
          success: result.matched === 4 && result.modified === 4
        }
      ]);
    } catch (error) {
      this.setState("tests", [
        ...this.state.tests,
        {
          name: "Update Many",
          success: false
        }
      ]);
    }
  }

  async #testRemove() {
    try {
      const result = await db.collection("users").remove({ email: this.#email });
      this.setState("tests", [
        ...this.state.tests,
        {
          name: "Remove",
          success: result.matched === 1
        }
      ]);
    } catch (error) {
      this.setState("tests", [
        ...this.state.tests,
        {
          name: "Remove",
          success: false
        }
      ]);
    }
  }
}

type State = {
  tests: Test[];
};

type Test = {
  name: string;
  success: boolean;
};
