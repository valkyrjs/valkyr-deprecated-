import { AccessService } from "@valkyr/access-nestjs";
import { Realms } from "stores";

export class RealmsAccess extends AccessService<Realms.Role["permissions"]> {
  async createAdminRole(workspaceId: string, members: string[]): Promise<void> {
    await this.roles.create(Realms.role.admin(workspaceId, members));
  }

  async createMemberRole(workspaceId: string, members: string[] = []): Promise<void> {
    await this.roles.create(Realms.role.member(workspaceId, members));
  }
}
