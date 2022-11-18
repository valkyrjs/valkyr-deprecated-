import { MongooseModule } from "@nestjs/mongoose";
import { MongoDbContainer, TestingModule } from "@valkyr/testing";

import { LedgerModule } from "../src/ledger.module";
import { EventStoreService } from "../src/services/event-store.service";

export class LedgerTestingModule extends TestingModule {
  #mongodb = new MongoDbContainer();

  get eventStore(): EventStoreService {
    return this.get(EventStoreService);
  }

  async start(): Promise<void> {
    await this.#mongodb.start();
    await this.createTestingModule({
      imports: [LedgerModule, MongooseModule.forRoot(this.#mongodb.uri)]
    });
    await this.app.init();
  }

  async stop(): Promise<void> {
    await this.app.close();
    await this.#mongodb.close();
  }
}
