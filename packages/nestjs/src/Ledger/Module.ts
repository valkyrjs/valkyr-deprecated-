import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { LedgerController } from "./Controller";
import { LedgerGateway } from "./Gateway";
import { Event, EventSchema } from "./Model";
import { LedgerService } from "./Service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Event.name,
        schema: EventSchema
      }
    ])
  ],
  controllers: [LedgerController],
  providers: [LedgerService, LedgerGateway],
  exports: [LedgerService]
})
export class LedgerModule {}
