import { container, Database, extend, Operation, RoleData } from "@valkyr/access";

import { collection } from "../Database/Collections";

container.set(
  "Database",
  new (class MongoDatabase implements Database {
    /**
     * Add new role to the persistent storage.
     */
    public async addRole(role: RoleData): Promise<void> {
      await collection.roles.insertOne(role);
    }

    /**
     * Retrieve role from persistent storage.
     */
    public async getRole<Permissions extends RoleData["permissions"]>(
      roleId: string
    ): Promise<RoleData<Permissions> | null> {
      return collection.roles.findOne({ roleId });
    }

    /**
     * Set permission configuration for the given role.
     */
    public async setPermissions(roleId: string, operations: Operation<any, any>[]): Promise<void> {
      const update: any = {};
      const $set: any = {};
      const $unset: any = {};

      for (const operation of operations) {
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
            $unset[path] = "";
            break;
          }
        }
      }

      if (Object.keys($set).length) {
        update.$set = $set;
      }

      if (Object.keys($unset).length) {
        update.$set = $unset;
      }

      await collection.roles.updateOne({ roleId }, update, { upsert: true });
    }

    /**
     * Retrieve all permissions assigned to the given member within the provided tenant.
     * A member can be assigned to multiple roles within a tenant so the permission
     * method should retrieve all roles for the given member and combine them into a single
     * permissions object.
     */
    public async getPermissions<Permissions extends RoleData["permissions"]>(memberId: string): Promise<Permissions> {
      return collection.roles
        .find({ members: memberId })
        .toArray()
        .then((roles) => roles.reduce((permissions, role) => extend(permissions, role), {} as Permissions));
    }

    public async addMember(roleId: string, memberId: string): Promise<void> {
      throw new Error("Method not implemented.");
    }

    /**
     * Add a member to given role.
     */
    public async delMember(roleId: string, memberId: string): Promise<void> {
      await collection.roles.updateOne(
        { roleId },
        {
          $push: {
            members: memberId
          }
        }
      );
    }

    /**
     * Remove a member from given role.
     */
    public async removeMember(roleId: string, memberId: string): Promise<void> {
      await collection.roles.updateOne(
        { roleId },
        {
          $pull: {
            members: memberId
          }
        }
      );
    }
  })()
);
