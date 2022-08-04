import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Role, RoleSchema } from "./Models/Role";
import { AccessService } from "./Services/AccessService";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Role.name,
        schema: RoleSchema
      }
    ])
  ],
  providers: [AccessService],
  exports: [AccessService]
})
export class AccessModule {}
