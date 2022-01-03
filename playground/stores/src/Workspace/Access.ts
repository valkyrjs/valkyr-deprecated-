import { Attributes, Role } from "@valkyr/access";

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
