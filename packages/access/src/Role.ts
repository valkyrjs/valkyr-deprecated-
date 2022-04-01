import { deepCopy, nanoid } from "@valkyr/utils";

import { Attributes } from "./Attributes";
import { db } from "./Database";
import { RolePermission, RolePermissions } from "./RolePermission";

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type RoleClass<T = unknown, P extends RolePermissions = RolePermissions> = {
  new (role: RoleData<P>): T;
  getPermissions(permissions: P): P;
};

type RoleSettings<P extends RolePermissions> = {
  tenantId: RoleData["tenantId"];
  name: RoleData["name"];
  settings?: RoleData["settings"];
  permissions?: RoleData<P>["permissions"];
  members?: RoleData["members"];
};

export type RoleData<Permissions extends RolePermissions = RolePermissions> = ReturnType<Role<Permissions>["toJSON"]>;

/*
 |--------------------------------------------------------------------------------
 | Role
 |--------------------------------------------------------------------------------
 */

export class Role<
  Permissions extends RolePermissions = RolePermissions,
  Settings extends Record<string, unknown> = Record<string, unknown>
> {
  public readonly tenantId = this.role.tenantId;
  public readonly roleId = this.role.roleId;

  public readonly name = this.role.name;
  public readonly settings = this.role.settings;
  public readonly permissions = this.role.permissions;
  public readonly members = Object.freeze(this.role.members);

  constructor(private readonly role: RoleData<Permissions>) {
    Object.freeze(this);
  }

  public static async create<P extends RolePermissions>(settings: RoleSettings<P>): Promise<string> {
    const roleId = nanoid();
    await db.addRole({
      tenantId: settings.tenantId,
      roleId,
      name: settings.name,
      settings: settings.settings ?? {},
      permissions: settings.permissions ?? {},
      members: settings.members ?? []
    });
    return roleId;
  }

  /**
   * Retrieve a role instance for the given role identifier.
   *
   * @param roleId - Role identifier to retrieve role for.
   *
   * @returns Role or undefined
   */
  public static async for<P extends RolePermissions, T extends Role<P>>(this: RoleClass<T, P>, roleId: string) {
    const data = await db.getRole<P>(roleId);
    if (data) {
      return new Role({
        ...data,
        permissions: this.getPermissions(data.permissions)
      });
    }
  }

  /**
   * Retrieve role attributes.
   *
   * @param flag - Current bitflag value
   *
   * @returns Attributes instance
   */
  public static getAttributes(_?: number): Attributes {
    throw new Error("Role Violation: Attributes method has not been implemented.");
  }

  /**
   * Map a partial list of permissions and return a full list of permissions.
   *
   * This is a resolver method that guarantees the permissions structure with
   * key => value pair fallback values when they are missing from the given
   * permissions.
   *
   * @param permissions - Permissions to resolve.
   *
   * @returns Permissions
   */
  public static getPermissions(_: Partial<RolePermissions>): RolePermissions {
    throw new Error("Role Violation: Permissions method has not been implemented.");
  }

  /*
   |--------------------------------------------------------------------------------
   | Permissions
   |--------------------------------------------------------------------------------
   */

  public get grant() {
    return new RolePermission<Permissions>(this.roleId).grant;
  }

  public get deny() {
    return new RolePermission<Permissions>(this.roleId).deny;
  }

  /*
   |--------------------------------------------------------------------------------
   | Members
   |--------------------------------------------------------------------------------
   */

  public async addMember(memberId: string) {
    return db.addMember(this.roleId, memberId);
  }

  public async delMember(memberId: string) {
    return db.delMember(this.roleId, memberId);
  }

  /*
   |--------------------------------------------------------------------------------
   | Serializer
   |--------------------------------------------------------------------------------
   */

  public toJSON(): {
    tenantId: string;
    roleId: string;
    name: string;
    settings: Settings;
    permissions: Permissions;
    members: string[];
  } {
    return deepCopy({
      roleId: this.roleId,
      name: this.name,
      settings: this.settings,
      permissions: this.permissions,
      members: [...this.members]
    });
  }
}
