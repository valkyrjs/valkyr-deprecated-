import { clone } from "@valkyr/utils";

import { Attributes } from "./Attributes";
import { RolePermission, RolePermissions } from "./RolePermission";

/*
 |--------------------------------------------------------------------------------
 | Role
 |--------------------------------------------------------------------------------
 */

export class Role<Permissions extends RolePermissions = RolePermissions> {
  public readonly tenantId = this.role.tenantId;
  public readonly roleId = this.role.roleId;

  public readonly name = this.role.name;
  public readonly settings = this.role.settings;
  public readonly permissions = this.role.permissions;
  public readonly members = Object.freeze(this.role.members);

  constructor(private readonly role: RoleData<Permissions>) {
    Object.freeze(this);
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
   | Serializer
   |--------------------------------------------------------------------------------
   */

  public toJSON(): {
    tenantId: string;
    roleId: string;
    name: string;
    settings: Record<string, unknown>;
    permissions: Permissions;
    members: string[];
  } {
    return clone({
      tenantId: this.tenantId,
      roleId: this.roleId,
      name: this.name,
      settings: this.settings,
      permissions: this.permissions,
      members: [...this.members]
    });
  }
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type RoleClass<T = unknown, P extends RolePermissions = RolePermissions> = {
  new (role: RoleData<P>): T;
  getPermissions(permissions: P): P;
};

export type RoleSettings<P extends RolePermissions> = {
  tenantId: RoleData["tenantId"];
  name: RoleData["name"];
  settings?: RoleData["settings"];
  permissions?: RoleData<P>["permissions"];
  members?: RoleData["members"];
};

export type RoleData<Permissions extends RolePermissions = RolePermissions> = ReturnType<Role<Permissions>["toJSON"]>;
