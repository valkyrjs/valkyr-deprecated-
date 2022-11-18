import { MongooseModule } from "@nestjs/mongoose";
import { MongoDbContainer, TestingModule } from "@valkyr/testing";

import { AccessModule } from "../src/access.module";
import { UserAccessService } from "./user-access.service";

export class AccessTestingModule extends TestingModule {
  #mongodb = new MongoDbContainer();

  get access(): UserAccessService {
    return this.get(UserAccessService);
  }

  async start(): Promise<void> {
    await this.#mongodb.start();
    await this.createTestingModule({
      imports: [AccessModule, MongooseModule.forRoot(this.#mongodb.uri)],
      providers: [UserAccessService]
    });
    await this.app.init();
  }

  async stop(): Promise<void> {
    await this.app.close();
    await this.#mongodb.close();
  }
}
