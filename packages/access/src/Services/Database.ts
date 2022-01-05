import type { Operation, RoleData } from "../Role";

export interface Database {
  /**
   * Add new role to the persistent storage.
   */
  addRole(role: RoleData): Promise<void>;

  /**
   * Retrieve role from persistent storage.
   */
  getRole(roleId: string): Promise<RoleData | undefined | null>;

  /**
   * Set permission configuration for the given role.
   */
  setPermissions(roleId: string, operations: Operation<any, any>[]): Promise<void>;

  /**
   * Retrieve all permissions assigned to the given member within the provided tenant.
   * A member can be assigned to multiple roles within a tenant so the permission
   * method should retrieve all roles for the given member and combine them into a single
   * permissions object.
   */
  getPermissions<Permissions extends RoleData["permissions"]>(tenantId: string, memberId: string): Promise<Permissions>;

  /**
   * Add a member to given role.
   */
  addMember(roleId: string, memberId: string): Promise<void>;

  /**
   * Remove a member from given role.
   */
  delMember(roleId: string, memberId: string): Promise<void>;
}
