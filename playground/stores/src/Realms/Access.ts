import { Attributes, Role as AccessRole, RoleSettings } from "@valkyr/access";
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

export class Role extends AccessRole<{
  realm: {
    setName: boolean;
    delete: boolean;
    createInvite: boolean;
    removeInvite: boolean;
    removeMember: boolean;
  };
}> {
  public static getAttributes(flag?: number) {
    return new Attributes(WORKSPACE_FLAGS, flag);
  }

  public static getPermissions({ realm }: Partial<Role["permissions"]>): Role["permissions"] {
    return {
      realm: {
        setName: realm?.setName === true,
        delete: realm?.delete === true,
        createInvite: realm?.createInvite === true,
        removeInvite: realm?.removeInvite === true,
        removeMember: realm?.removeMember === true
      }
    };
  }
}

export const role = {
  admin: (workspaceId: string, members: string[]): RoleSettings<Role["permissions"]> => ({
    id: getId(),
    tenantId: workspaceId,
    name: "Admin",
    settings: {},
    permissions: {
      realm: {
        setName: true,
        delete: true,
        createInvite: true,
        removeInvite: true,
        removeMember: true
      }
    },
    members
  }),
  member: (workspaceId: string, members: string[]): RoleSettings<Role["permissions"]> => ({
    id: getId(),
    tenantId: workspaceId,
    name: "Member",
    settings: {},
    permissions: {
      realm: {
        setName: false,
        delete: false,
        createInvite: false,
        removeInvite: false,
        removeMember: false
      }
    },
    members
  })
};
