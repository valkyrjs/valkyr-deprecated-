import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { IdentityController } from "./Controllers/IdentityController";
import { IdentityGuard } from "./Guards/IdentityGuard";
import { Identity, IdentitySchema } from "./Models/Identity";
import { IdentityService } from "./Services/IdentityService";

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Identity.name,
        schema: IdentitySchema
      }
    ])
  ],
  controllers: [IdentityController],
  providers: [IdentityService, IdentityGuard],
  exports: [IdentityService]
})
export class IdentityModule {}
