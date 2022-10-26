import { Controller, ViewController } from "@valkyr/react";

import { Test } from "./test.model";

const mock = [
  {
    type: "insertOne",
    data: {
      id: "xyz",
      foo: "bar"
    }
  },
  {
    type: "updateOne",
    data: {
      id: "xyz",
      foo: "bar1"
    }
  },
  {
    type: "updateOne",
    data: {
      id: "xyz",
      foo: "bar2"
    }
  },
  {
    type: "updateOne",
    data: {
      id: "xyz",
      foo: "bar3"
    }
  },
  {
    type: "updateOne",
    data: {
      id: "xyz",
      foo: "bar4"
    }
  },
  {
    type: "updateOne",
    data: {
      id: "xyz",
      foo: "bar5"
    }
  },
  {
    type: "updateOne",
    data: {
      id: "xyz",
      foo: "bar6"
    }
  },
  {
    type: "updateOne",
    data: {
      id: "xyz",
      foo: "bar7"
    }
  }
];

class DatabaseController extends Controller<State> {
  async onInit() {
    return {
      tests: await this.query(Test, {}, "tests")
    };
  }

  async run() {
    for (const { type, data } of mock) {
      if (type === "insertOne") {
        await Test.insertOne(data);
      } else {
        await Test.updateOne(
          { id: data.id },
          {
            $set: {
              foo: data.foo
            }
          }
        );
      }
    }
  }
}

type State = {
  tests: Test[];
};

export const controller = new ViewController(DatabaseController);
