import { AccessService } from "@valkyr/angular";
import { WorkspaceStore } from "stores";

export class WorkspaceAccess extends AccessService<WorkspaceStore.WorkspaceRole["permissions"]> {
  public async createAdminRole(workspaceId: string, members: string[]): Promise<void> {
    await this.roles.create({
      tenantId: workspaceId,
      name: "Admin",
      permissions: {
        workspace: {
          setName: true,
          delete: true,
          createInvite: true,
          removeInvite: true,
          removeMember: true
        },
        todo: {
          create: true,
          remove: true,
          addItem: true,
          addItemText: true,
          setItemDone: true,
          setItemUndone: true,
          removeItem: true
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
        workspace: {
          setName: false,
          delete: false,
          createInvite: false,
          removeInvite: false,
          removeMember: false
        },
        todo: {
          create: false,
          remove: false,
          addItem: true,
          addItemText: true,
          setItemDone: true,
          setItemUndone: true,
          removeItem: true
        }
      },
      members
    });
  }
}
