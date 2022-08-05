import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Role, RoleSchema } from "./Models/Role";
import { AccessService } from "./Services/AccessService";
import { RoleService } from "./Services/RoleService";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Role.name,
        schema: RoleSchema
      }
    ])
  ],
  providers: [AccessService, RoleService],
  exports: [AccessService, RoleService]
})
export class AccessModule {}
