import { Injectable } from "@nestjs/common";
import {
  Operation,
  permissionDenied,
  PermissionDeniedError,
  permissionGranted,
  PermissionHandler,
  permissionOperation,
  Role as AccessRole,
  RoleSettings
} from "@valkyr/access";
import { Model } from "mongoose";

import { Role, RoleDocument } from "../Models/Role";
import { RoleService } from "./RoleService";

@Injectable()
export class AccessService<
  Permissions extends AccessRole["permissions"] = AccessRole["permissions"],
  Resource extends keyof Permissions = keyof Permissions
> {
  readonly roles: Model<RoleDocument>;

  constructor(roles: RoleService) {
    this.roles = roles.model;
  }

  /*
   |--------------------------------------------------------------------------------
   | Roles
   |--------------------------------------------------------------------------------
   */

  /**
   * Add a new access control role.
   *
   * @param container - Container the role resides under.
   * @param role      - Role details settings.
   */
  async addRole(container: string, role: RoleSettings<Permissions>): Promise<void> {
    await this.roles.create({ ...role, container });
  }

  /**
   * Get a role by its primary identifier.
   *
   * @param roleId - Role primary identifier.
   */
  async getRoleById(roleId: string): Promise<Role | null> {
    return this.roles.findOne({ id: roleId });
  }

  /**
   * Get a list of roles added under the provided container.
   */
  async getRolesByContainer(container: string): Promise<Role[]> {
    return this.roles.find({ container });
  }

  /**
   * Get a list of roles added under the provided member identifier.
   */
  async getRolesByMember(memberId: string): Promise<Role[]> {
    return this.roles.find({ members: memberId });
  }

  /*
   |--------------------------------------------------------------------------------
   | Members
   |--------------------------------------------------------------------------------
   */

  /**
   * Add a member to a role.
   *
   * @param roleId   - Role primary identifier to add member to.
   * @param memberId - Member identifier.
   */
  async addMember(roleId: string, memberId: string) {
    await this.roles.updateOne(
      { id: roleId },
      {
        $push: {
          members: memberId
        }
      }
    );
  }

  /**
   * Remove a member from a role.
   *
   * @param roleId   - Role primary identifier to remove member from.
   * @param memberId - Member identifier.
   */
  async delMember(roleId: string, memberId: string) {
    await this.roles.updateOne(
      { id: roleId },
      {
        $pull: {
          members: memberId
        }
      }
    );
  }

  /*
   |--------------------------------------------------------------------------------
   | Permissions
   |--------------------------------------------------------------------------------
   */

  /**
   * Set new permissions settings onto the given role.
   *
   * @remarks The permission setter takes a list of access control operations which
   * is parsed through a permission operation producing a mongodb compliant query.
   *
   * @param roleId     - Role primary identifier to update permissions settings for.
   * @param operations - Permission operations to execute during the update.
   */
  async setPermissions(roleId: string, operations: Operation<any, any>[]) {
    if (operations.length > 0) {
      let update: Record<string, unknown> = {};
      for (const operation of operations) {
        update = permissionOperation[operation.type](update, operation as any);
      }
      await this.roles.updateOne({ id: roleId }, update, { upsert: true });
    }
  }

  /**
   * Get permissions for a given resource and return a permission query object.
   *
   * @param container - Container identifier the permissions resides within.
   * @param resource  - Permission resource to validate action under.
   *
   * @returns Permission query object.
   */
  for<R extends Resource>(container: string, resource: R) {
    return {
      can: async <A extends keyof Permissions[R], Handler extends PermissionHandler>(
        memberId: string,
        action: A,
        handler?: Handler
      ) => {
        const permissions = await this.#getPermissions(container, memberId);
        const value = permissions[resource][action];
        if (handler === undefined) {
          return this.#getPermissionByValue(value, action, resource);
        }
        return handler(value);
      }
    };
  }

  /*
   |--------------------------------------------------------------------------------
   | Utilities
   |--------------------------------------------------------------------------------
   */

  reduce(_: Role[]): Permissions {
    throw new Error(
      `Access Service Violation: No reduce method has been defined on the ${this.constructor.name} service`
    );
  }

  /**
   * Gets a compiled permissions state object for given member id within provided
   * container scope.
   *
   * @param container - Container to fetch permissions under.
   * @param memberId  - Member identifier to compile permissions for.
   */
  async #getPermissions(container: string, memberId: string): Promise<Permissions> {
    return this.reduce(await this.roles.find({ container, members: memberId }));
  }

  #getPermissionByValue(value: unknown, action: unknown, resource: unknown) {
    if (value === true) {
      return permissionGranted();
    }
    return permissionDenied(new PermissionDeniedError(action, resource).message);
  }
}
