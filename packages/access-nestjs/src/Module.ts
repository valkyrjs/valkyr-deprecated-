import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { AccessController } from "./Controllers/AccessController";
import { Role, RoleSchema } from "./Models/Role";
import { AccessService } from "./Services/AccessService";
import { MemberService } from "./Services/MemberService";
import { PermissionService } from "./Services/PermissionService";
import { RoleService } from "./Services/RoleService";

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Role.name,
        schema: RoleSchema
      }
    ])
  ],
  controllers: [AccessController],
  providers: [AccessService, MemberService, PermissionService, RoleService],
  exports: [AccessService, MemberService, PermissionService, RoleService]
})
export class AccessModule {}
