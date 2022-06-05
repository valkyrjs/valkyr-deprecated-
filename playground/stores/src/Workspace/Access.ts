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
  item: {
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
    item
  }: Partial<WorkspaceRole["permissions"]>): WorkspaceRole["permissions"] {
    return {
      workspace: {
        setName: workspace?.setName === true,
        delete: workspace?.delete === true,
        createInvite: workspace?.createInvite === true,
        removeInvite: workspace?.removeInvite === true,
        removeMember: workspace?.removeMember === true
      },
      item: {
        create: item?.create === true,
        remove: item?.remove === true,
        addItem: item?.addItem === true,
        addItemText: item?.addItemText === true,
        setItemDone: item?.setItemDone === true,
        setItemUndone: item?.setItemUndone === true,
        removeItem: item?.removeItem === true
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
      item: {
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
      item: {
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
