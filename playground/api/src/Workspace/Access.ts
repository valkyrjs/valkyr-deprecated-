import { AccessService } from "@valkyr/nestjs";
import { WorkspaceStore } from "stores";

export class WorkspaceAccess extends AccessService<WorkspaceStore.WorkspaceRole["permissions"]> {
  async createAdminRole(workspaceId: string, members: string[]): Promise<void> {
    await this.roles.create(WorkspaceStore.roles.admin(workspaceId, members));
  }

  async createMemberRole(workspaceId: string, members: string[] = []): Promise<void> {
    await this.roles.create(WorkspaceStore.roles.member(workspaceId, members));
  }
}
