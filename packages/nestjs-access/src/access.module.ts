import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { RoleEntity, RoleSchema } from "./models/role.entity";
import { AccessService } from "./services/access.service";
import { RoleService } from "./services/role.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RoleEntity.name,
        schema: RoleSchema
      }
    ])
  ],
  providers: [AccessService, RoleService],
  exports: [AccessService, RoleService]
})
export class AccessModule {}
