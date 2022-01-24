import { container, Database, RoleData } from "@valkyr/access";

import { socket } from "./socket";

container.set(
  "Database",
  new (class WebDatabase implements Database {
    /**
     * Add new role to the persistent storage.
     */
    public async addRole(): Promise<void> {
      throw new Error("Operation cannot be performed on client");
    }

    /**
     * Retrieve role from persistent storage.
     */
    public async getRole(roleId: string): Promise<RoleData | null> {
      return socket.send("auth.getRole", { roleId });
    }

    /**
     * Set permission configuration for the given role.
     */
    public async setPermissions(): Promise<void> {
      throw new Error("Operation cannot be performed on client");
    }

    /**
     * Retrieve all permissions assigned to the given member within the provided tenant.
     * A member can be assigned to multiple roles within a tenant so the permission
     * method should retrieve all roles for the given member and combine them into a single
     * permissions object.
     */
    public async getPermissions<Permissions extends RoleData["permissions"]>(tenantId: string): Promise<Permissions> {
      return socket.send("auth.getPermissions", { tenantId });
    }

    /**
     * Add a member to given role.
     */
    public async addMember(): Promise<void> {
      throw new Error("Operation cannot be performed on client");
    }

    /**
     * Remove a member from given role.
     */
    public async delMember(): Promise<void> {
      throw new Error("Operation cannot be performed on client");
    }
  })()
);
