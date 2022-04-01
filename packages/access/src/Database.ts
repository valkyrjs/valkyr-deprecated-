import { extend } from "@valkyr/utils";

import { container } from "./Container";
import type { RoleData } from "./Role";
import type { Operation } from "./RolePermission";

export const db = {
  get roles() {
    return container.get("Database").collection<RoleData<any>>("roles");
  },

  /**
   * Add new role to the persistent storage.
   */
  async addRole(role: RoleData): Promise<void> {
    await this.roles.insertOne(role);
  },

  /**
   * Retrieve role from persistent storage.
   */
  async getRole<Permissions extends RoleData["permissions"]>(roleId: string): Promise<RoleData<Permissions> | null> {
    return this.roles.findOne({ roleId });
  },

  /**
   * Set permission configuration for the given role.
   */
  async setPermissions(roleId: string, operations: Operation<any, any>[]): Promise<void> {
    let $set: Record<string, unknown> = {};
    for (const operation of operations) {
      $set = {
        ...$set,
        ...getPermissionUpdate(operation)
      };
    }
    if (Object.keys($set).length) {
      await this.roles.updateOne({ roleId }, { $set }, { upsert: true });
    }
  },

  /**
   * Retrieve all permissions assigned to the given member within the provided tenant.
   * A member can be assigned to multiple roles within a tenant so the permission
   * method should retrieve all roles for the given member and combine them into a single
   * permissions object.
   */
  async getPermissions<Permissions extends RoleData["permissions"]>(memberId: string): Promise<Permissions> {
    return this.roles
      .find({ members: memberId })
      .toArray()
      .then((roles) => roles.reduce((permissions, role) => extend(permissions, role.permissions), {} as Permissions));
  },

  /**
   * Add a member to given role.
   */
  async addMember(roleId: string, memberId: string): Promise<void> {
    await this.roles.updateOne(
      { roleId },
      {
        $push: {
          members: memberId
        }
      }
    );
  },

  /**
   * Remove a member from given role.
   */
  async delMember(roleId: string, memberId: string): Promise<void> {
    await this.roles.updateOne(
      { roleId },
      {
        $pull: {
          members: memberId
        }
      }
    );
  }
};

function getPermissionUpdate(operation: Operation<any, any>) {
  const $set: Record<string, unknown> = {};
  switch (operation.type) {
    case "set": {
      const { resource, action, data = true } = operation;
      $set[`permissions.${resource}.${action}`] = data;
      break;
    }
    case "unset": {
      const { resource, action } = operation;
      let path = `permissions.${resource}`;
      if (action) {
        path += `.${action}`;
      }
      $set[path] = "";
      break;
    }
  }
  return $set;
}
