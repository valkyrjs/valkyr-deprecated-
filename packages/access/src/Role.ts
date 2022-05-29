import { clone } from "@valkyr/utils";

import { Attributes } from "./Attributes";
import { RolePermission, RolePermissions } from "./RolePermission";

/*
 |--------------------------------------------------------------------------------
 | Role
 |--------------------------------------------------------------------------------
 */

export class Role<Permissions extends RolePermissions = RolePermissions> {
  readonly id = this.role.id;
  readonly tenantId = this.role.tenantId;
  readonly name = this.role.name;
  readonly settings = this.role.settings;
  readonly permissions = this.role.permissions;
  readonly members = Object.freeze(this.role.members);

  constructor(readonly role: RoleData<Permissions>) {
    Object.freeze(this);
  }

  /**
   * Retrieve role attributes.
   *
   * @param flag - Current bitflag value
   *
   * @returns Attributes instance
   */
  static getAttributes(_?: number): Attributes {
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
  static getPermissions(_: Partial<RolePermissions>): RolePermissions {
    throw new Error("Role Violation: Permissions method has not been implemented.");
  }

  /*
   |--------------------------------------------------------------------------------
   | Permissions
   |--------------------------------------------------------------------------------
   */

  get grant() {
    return new RolePermission<Permissions>(this.id).grant;
  }

  get deny() {
    return new RolePermission<Permissions>(this.id).deny;
  }

  /*
   |--------------------------------------------------------------------------------
   | Serializer
   |--------------------------------------------------------------------------------
   */

  toJSON(): {
    id: string;
    tenantId: string;
    name: string;
    settings: Record<string, unknown>;
    permissions: Permissions;
    members: string[];
  } {
    return clone({
      id: this.id,
      tenantId: this.tenantId,
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
  id: RoleData["id"];
  tenantId: RoleData["tenantId"];
  name: RoleData["name"];
  settings?: RoleData["settings"];
  permissions?: RoleData<P>["permissions"];
  members?: RoleData["members"];
};

export type RoleData<Permissions extends RolePermissions = RolePermissions> = ReturnType<Role<Permissions>["toJSON"]>;
