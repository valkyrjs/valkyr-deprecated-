import { DynamicModule, Global, Module, Type } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { LedgerController } from "./Controllers/LedgerController";
import { LedgerGateway } from "./Gateway";
import { LedgerStreamGuard, STREAM_GUARD } from "./Guards/LedgerStreamGuards";
import { Event, EventSchema } from "./Models/Event";
import { LedgerService } from "./Services/LedgerService";

@Global()
@Module({})
export class LedgerModule {
  static register(options: Options): DynamicModule {
    return {
      module: LedgerModule,
      imports: [
        MongooseModule.forFeature([
          {
            name: Event.name,
            schema: EventSchema
          }
        ])
      ],
      controllers: [LedgerController],
      providers: [
        {
          provide: STREAM_GUARD,
          useClass: options.StreamGuard
        },
        LedgerService,
        LedgerGateway
      ],
      exports: [LedgerService]
    };
  }
}

type Options = {
  StreamGuard: Type<LedgerStreamGuard>;
};
