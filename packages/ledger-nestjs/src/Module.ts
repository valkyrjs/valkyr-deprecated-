import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Event, EventSchema } from "./Models/Event";
import { LedgerService } from "./Services/LedgerService";

export * from "@valkyr/ledger";

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Event.name,
        schema: EventSchema
      }
    ])
  ],
  providers: [LedgerService],
  exports: [LedgerService]
})
export class LedgerModule {}
