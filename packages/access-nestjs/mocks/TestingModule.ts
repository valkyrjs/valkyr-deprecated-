import { INestApplication } from "@nestjs/common";
import * as Testing from "@nestjs/testing";

export abstract class TestingModule {
  #ref?: Testing.TestingModule;

  #app?: INestApplication;

  /*
   |--------------------------------------------------------------------------------
   | Testing Module Reference [NestJS]
   |--------------------------------------------------------------------------------
   */

  get get() {
    if (this.#app !== undefined) {
      return this.#app.get.bind(this.#app);
    }
    return this.ref.get.bind(this.ref);
  }

  get ref(): Testing.TestingModule {
    if (this.#ref === undefined) {
      throw new Error("TestingModule Violation: Module reference is not set, did you start the testing module?");
    }
    return this.#ref;
  }

  set ref(value: Testing.TestingModule) {
    this.#ref = value;
  }

  get app(): INestApplication {
    if (this.#app === undefined) {
      throw new Error("TestingModule Violation: Application reference is not set, did you create a new app instance?");
    }
    return this.#app;
  }

  set app(value: INestApplication) {
    this.#app = value;
  }

  /*
   |--------------------------------------------------------------------------------
   | Testing Lifecycle
   |--------------------------------------------------------------------------------
   */

  abstract start(): Promise<void>;
  abstract stop(): Promise<void>;
}
