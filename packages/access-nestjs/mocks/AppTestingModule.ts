import { MongooseModule } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";

import { AccessTestingModule, TestAccessService } from "./AccessTestingModule";
import { MongoDBContainer } from "./MongoDbContainer";
import { TestingModule } from "./TestingModule";

/*
 |--------------------------------------------------------------------------------
 | App Test Module
 |--------------------------------------------------------------------------------
 */

export class AppTestingModule extends TestingModule {
  #mongodb = new MongoDBContainer();

  /*
   |--------------------------------------------------------------------------------
   | Services
   |--------------------------------------------------------------------------------
   */

  get access(): TestAccessService {
    return this.get<TestAccessService>(TestAccessService);
  }

  /*
   |--------------------------------------------------------------------------------
   | Lifecycle
   |--------------------------------------------------------------------------------
   */

  public async start(): Promise<void> {
    await this.#mongodb.start();

    await this.#loadModule();
    await this.#loadApp();

    await this.app.init();
  }

  public async stop(): Promise<void> {
    await this.app.close();
    await this.#mongodb.close();
  }

  /*
   |--------------------------------------------------------------------------------
   | Utilities
   |--------------------------------------------------------------------------------
   */

  async #loadModule(): Promise<void> {
    this.ref = await Test.createTestingModule({
      imports: [AccessTestingModule, MongooseModule.forRoot(this.#mongodb.uri)]
    }).compile();
  }

  async #loadApp(): Promise<void> {
    this.app = this.ref.createNestApplication();
  }
}
