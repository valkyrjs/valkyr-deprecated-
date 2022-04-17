import { Controller, Get, Param } from "@nestjs/common";

import { PermissionService } from "./Services/Permission";

@Controller("/access")
export class AccessController {
  constructor(private readonly permission: PermissionService) {}

  @Get(":member/permissions")
  public async getEvents(@Param("member") memberId: string) {
    return this.permission.get(memberId);
  }
}
