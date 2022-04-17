import { AccessService } from "@valkyr/nestjs";
import { WorkspaceStore } from "stores";

export class WorkspaceAccess extends AccessService<WorkspaceStore.WorkspaceRole["permissions"]> {
  public async createAdminRole(workspaceId: string, members: string[]): Promise<void> {
    await this.roles.create({
      tenantId: workspaceId,
      name: "Admin",
      permissions: {
        workspace: {
          setName: true,
          addMember: true,
          delete: true
        },
        todo: {
          create: true,
          assign: true,
          setData: true,
          delete: true
        }
      },
      members
    });
  }

  public async createMemberRole(workspaceId: string, members: string[] = []): Promise<void> {
    await this.roles.create({
      tenantId: workspaceId,
      name: "Member",
      permissions: {
        todo: {
          create: true,
          assign: true,
          setData: true,
          delete: true
        }
      },
      members
    });
  }
}
