import { INestApplication, ModuleMetadata, NestApplicationOptions } from "@nestjs/common";
import { Test, TestingModule as NestJsTestingModule } from "@nestjs/testing";

export abstract class TestingModule {
  #ref?: NestJsTestingModule;
  #app?: INestApplication;

  get get() {
    if (this.#app !== undefined) {
      return this.app.get.bind(this.#app);
    }
    return this.ref.get.bind(this.#ref);
  }

  get ref(): NestJsTestingModule {
    if (this.#ref === undefined) {
      throw new Error("TestingModule Violation: Module reference is not set, did you start the testing module?");
    }
    return this.#ref;
  }

  get app(): INestApplication {
    if (this.#app === undefined) {
      throw new Error("TestingModule Violation: Application reference is not set, did you create a new app instance?");
    }
    return this.#app;
  }

  /*
   |--------------------------------------------------------------------------------
   | Testing Lifecycle
   |--------------------------------------------------------------------------------
   */

  abstract start(): Promise<void>;
  abstract stop(): Promise<void>;

  /*
   |--------------------------------------------------------------------------------
   | Testing Actions
   |--------------------------------------------------------------------------------
   */

  async createTestingModule(metaData?: ModuleMetadata, options?: NestApplicationOptions | undefined): Promise<void> {
    this.#ref = await Test.createTestingModule(metaData ?? {}).compile();
    this.#app = this.#ref.createNestApplication(options);
  }
}
