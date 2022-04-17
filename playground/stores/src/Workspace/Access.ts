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
