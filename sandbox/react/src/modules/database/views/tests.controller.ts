import { faker } from "@faker-js/faker";
import { Controller, ViewController } from "@valkyr/react";

import { db } from "~services/database";

import { User } from "../models/user.entity";

class TestsController extends Controller<State> {
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
      await User.insertOne(User.fake());
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
      await User.insertMany([User.fake(), User.fake(), User.fake()]);
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
    const user = await User.findOne();
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
      const result = await User.updateOne({ id: user.id }, { $set: { email: this.#email } });
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
      const result = await User.updateMany(
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
      const result = await User.remove({ email: this.#email });
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

export const controller = new ViewController(TestsController);
