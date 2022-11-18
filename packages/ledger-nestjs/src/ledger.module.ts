import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { EventEntity, EventSchema } from "./models/event.entity";
import { EventStoreService } from "./services/event-store.service";

export * from "@valkyr/ledger";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: EventEntity.name,
        schema: EventSchema
      }
    ])
  ],
  providers: [EventStoreService],
  exports: [EventStoreService]
})
export class LedgerModule {}
