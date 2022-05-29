import { Attributes, Role, RoleSettings } from "@valkyr/access";
import { getId } from "@valkyr/security";

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
    delete: boolean;
    createInvite: boolean;
    removeInvite: boolean;
    removeMember: boolean;
  };
  todo: {
    create: boolean;
    remove: boolean;
    addItem: boolean;
    addItemText: boolean;
    setItemDone: boolean;
    setItemUndone: boolean;
    removeItem: boolean;
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
        delete: workspace?.delete === true,
        createInvite: workspace?.createInvite === true,
        removeInvite: workspace?.removeInvite === true,
        removeMember: workspace?.removeMember === true
      },
      todo: {
        create: todo?.create === true,
        remove: todo?.remove === true,
        addItem: todo?.addItem === true,
        addItemText: todo?.addItemText === true,
        setItemDone: todo?.setItemDone === true,
        setItemUndone: todo?.setItemUndone === true,
        removeItem: todo?.removeItem === true
      }
    };
  }
}

export const roles = {
  admin: (workspaceId: string, members: string[]): RoleSettings<WorkspaceRole["permissions"]> => ({
    id: getId(),
    tenantId: workspaceId,
    name: "Admin",
    settings: {},
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
  }),
  member: (workspaceId: string, members: string[]): RoleSettings<WorkspaceRole["permissions"]> => ({
    id: getId(),
    tenantId: workspaceId,
    name: "Member",
    settings: {},
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
  })
};
