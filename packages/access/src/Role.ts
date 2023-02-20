import { Attributes } from "./Attributes.js";
import { clone } from "./Clone.js";
import { RolePermission, RolePermissions } from "./RolePermission.js";

/*
 |--------------------------------------------------------------------------------
 | Role
 |--------------------------------------------------------------------------------
 */

export class Role<Permissions extends RolePermissions = RolePermissions> {
  constructor(readonly role: RoleData<Permissions>) {
    Object.freeze(this);
  }

  /*
   |--------------------------------------------------------------------------------
   | Accessors
   |--------------------------------------------------------------------------------
   */

  get id() {
    return this.role.id;
  }

  get container() {
    return this.role.container;
  }

  get name() {
    return this.role.name;
  }

  get settings() {
    return this.role.settings;
  }

  get permissions() {
    return this.role.permissions;
  }

  get members() {
    return Object.freeze(this.role.members);
  }

  /*
   |--------------------------------------------------------------------------------
   | Factories
   |--------------------------------------------------------------------------------
   */

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

  /**
   * Reduce multiple permission states into a single permission object.
   *
   * @remarks This method introduces the ability to deal with complex permission
   * state logic allowing for the role to determine its own reducer rules which can
   * be shared in a full stack environment.
   *
   * @param state       - Base permission template being folded onto.
   * @param permissions - Role permissions to fold onto the given state.
   *
   * @returns Permissions
   */
  static reduce(_: RolePermissions, __: Partial<RolePermissions>): RolePermissions {
    throw new Error("Role Violation: Reduce method has not been implemented.");
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

  toJSON(): RoleJSON<Permissions> {
    return clone({
      id: this.id,
      container: this.container,
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
  container: RoleData["container"];
  name: RoleData["name"];
  settings?: RoleData["settings"];
  permissions?: RoleData<P>["permissions"];
  members?: RoleData["members"];
};

export type RoleData<Permissions extends RolePermissions = RolePermissions> = RoleJSON<Permissions>;

export type RoleJSON<Permissions> = {
  id: string;
  container: string;
  name: string;
  settings: Record<string, unknown>;
  permissions: Permissions;
  members: string[];
};
