"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessService = void 0;
const access_1 = require("@valkyr/access");
const roles_collection_1 = require("./roles.collection");
class AccessService {
    roles;
    constructor(roles = roles_collection_1.roles) {
        this.roles = roles;
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
    async addRole(container, role) {
        await this.roles.insertOne({
            id: role.id,
            container,
            name: role.name,
            settings: role.settings ?? {},
            permissions: role.permissions ?? {},
            members: role.members ?? []
        });
    }
    /**
     * Get a role by its primary identifier.
     *
     * @param roleId - Role primary identifier.
     */
    async getRoleById(roleId) {
        return this.roles.findOne({ id: roleId });
    }
    /**
     * Get a list of roles added under the provided container.
     */
    async getRolesByContainer(container) {
        return this.roles.find({ container }).toArray();
    }
    /**
     * Get a list of roles added under the provided member identifier.
     */
    async getRolesByMember(memberId) {
        return this.roles.find({ members: memberId }).toArray();
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
    async addMember(roleId, memberId) {
        await this.roles.updateOne({ id: roleId }, {
            $push: {
                members: memberId
            }
        });
    }
    /**
     * Remove a member from a role.
     *
     * @param roleId   - Role primary identifier to remove member from.
     * @param memberId - Member identifier.
     */
    async delMember(roleId, memberId) {
        await this.roles.updateOne({ id: roleId }, {
            $pull: {
                members: memberId
            }
        });
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
    async setPermissions(roleId, operations) {
        if (operations.length > 0) {
            let update = {};
            for (const operation of operations) {
                update = access_1.permissionOperation[operation.type](update, operation);
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
    for(container, resource) {
        return {
            can: async (memberId, action, handler) => {
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
    reduce(_) {
        throw new Error(`Access Service Violation: No reduce method has been defined on the ${this.constructor.name} service`);
    }
    /**
     * Gets a compiled permissions state object for given member id within provided
     * container scope.
     *
     * @param container - Container to fetch permissions under.
     * @param memberId  - Member identifier to compile permissions for.
     */
    async #getPermissions(container, memberId) {
        return this.reduce(await this.roles.find({ container, members: memberId }).toArray());
    }
    #getPermissionByValue(value, action, resource) {
        if (value === true) {
            return (0, access_1.permissionGranted)();
        }
        return (0, access_1.permissionDenied)(new access_1.PermissionDeniedError(action, resource).message);
    }
}
exports.AccessService = AccessService;
