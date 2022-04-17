import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { AccessController } from "./Controller";
import { Role, RoleSchema } from "./Model";
import { AccessService } from "./Services/Access";
import { MemberService } from "./Services/Member";
import { PermissionService } from "./Services/Permission";
import { RoleService } from "./Services/Role";

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
