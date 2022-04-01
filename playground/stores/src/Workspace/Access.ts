import { Attributes, createPermission, getPermissions, Role } from "@valkyr/access";

/*
 |--------------------------------------------------------------------------------
 | Bitflags
 |--------------------------------------------------------------------------------
 */

export const WORKSPACE_FLAGS: Record<string, number> = {
  id: 1 << 0,
  name: 1 << 1,
  members: 1 << 2
};

/*
 |--------------------------------------------------------------------------------
 | Role
 |--------------------------------------------------------------------------------
 */

export class WorkspaceRole extends Role<{
  workspace: {
    setName: boolean;
    addMember: boolean;
    delete: boolean;
  };
  todo: {
    create: boolean;
    assign: boolean;
    setData: boolean;
    delete: boolean;
  };
}> {
  public static getAttributes(flag?: number) {
    return new Attributes(WORKSPACE_FLAGS, flag);
  }

  public static getPermissions({
    workspace,
    todo
  }: Partial<WorkspaceRole["permissions"]>): WorkspaceRole["permissions"] {
    return {
      workspace: {
        setName: workspace?.setName === true,
        addMember: workspace?.addMember === true,
        delete: workspace?.delete === true
      },
      todo: {
        create: todo?.create === true,
        assign: todo?.assign === true,
        setData: todo?.setData === true,
        delete: todo?.delete === true
      }
    };
  }
}

/*
 |--------------------------------------------------------------------------------
 | Access
 |--------------------------------------------------------------------------------
 */

export const access = {
  setup: async (workspaceId: string, members: string[]) => {
    await createAdminRole(workspaceId, members);
    await createMemberRole(workspaceId);
  },
  for: createPermission<WorkspaceRole["permissions"]>(),
  permissions: getPermissions<WorkspaceRole["permissions"]>()
};

export async function createAdminRole(workspaceId: string, members: string[]): Promise<void> {
  await WorkspaceRole.create({
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

export async function createMemberRole(workspaceId: string): Promise<void> {
  await WorkspaceRole.create({
    tenantId: workspaceId,
    name: "Member",
    permissions: {
      todo: {
        create: true,
        assign: true,
        setData: true,
        delete: true
      }
    }
  });
}
