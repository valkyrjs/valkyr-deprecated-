import { RoleSettings } from "@valkyr/access";

import { AccessTestingModule } from "../mocks/access.module";
import { UserPermissions } from "../mocks/user.role";

/*
 |--------------------------------------------------------------------------------
 | Data
 |--------------------------------------------------------------------------------
 */

const ROLE_CONTAINER = "xyz";
const ROLE_MEMBER = "abc";

const adminRoleData: RoleSettings<UserPermissions> = {
  id: "xyz-1",
  container: ROLE_CONTAINER,
  name: "Administrator",
  settings: {},
  permissions: {
    users: {
      create: true
    }
  },
  members: []
};

const userRoleData: RoleSettings<UserPermissions> = {
  id: "xyz-2",
  container: ROLE_CONTAINER,
  name: "User",
  settings: {},
  permissions: {
    users: {
      create: false
    }
  },
  members: []
};

/*
 |--------------------------------------------------------------------------------
 | Bootstrap
 |--------------------------------------------------------------------------------
 */

const testing = new AccessTestingModule();

beforeAll(async () => {
  await testing.start();
  await testing.access.addRole(ROLE_CONTAINER, adminRoleData);
  await testing.access.addRole(ROLE_CONTAINER, userRoleData);
});

afterAll(async () => {
  await testing.stop();
});

/*
 |--------------------------------------------------------------------------------
 | Tests
 |--------------------------------------------------------------------------------
 */

describe("Access Service", () => {
  describe("when executing against role methods", () => {
    it("should have successfully created admin role", async () => {
      const role = await testing.access.getRoleById(adminRoleData.id);
      if (role === null) {
        throw new Error("Role has not been defined");
      }

      expect(role.id).toEqual(adminRoleData.id);
      expect(role.name).toEqual(adminRoleData.name);
      expect(role.settings).toEqual(adminRoleData.settings);
      expect(role.permissions).toEqual(adminRoleData.permissions);
      expect(role.members).toEqual(adminRoleData.members);
    });

    it("should have successfully created user role", async () => {
      const role = await testing.access.getRoleById(userRoleData.id);
      if (role === null) {
        throw new Error("Role has not been defined");
      }

      expect(role.id).toEqual(userRoleData.id);
      expect(role.name).toEqual(userRoleData.name);
      expect(role.settings).toEqual(userRoleData.settings);
      expect(role.permissions).toEqual(userRoleData.permissions);
      expect(role.members).toEqual(userRoleData.members);
    });

    it("should successfully get roles by container", async () => {
      const roles = await testing.access.getRolesByContainer(ROLE_CONTAINER);
      expect(roles.length).toEqual(2);
    });
  });

  describe("when executing against member based methods", () => {
    beforeAll(async () => {
      await testing.access.addMember(userRoleData.id, ROLE_MEMBER);
    });

    it("should successfully get roles for a given member", async () => {
      const roles = await testing.access.getRolesByMember(ROLE_MEMBER);
      expect(roles.length).toEqual(1);
    });

    it("should successfully execute a permission check with permission denied", async () => {
      const permission = await testing.access.for(ROLE_CONTAINER, "users").can(ROLE_MEMBER, "create");
      expect(permission.granted).toEqual(false);
    });

    it("should successfully execute a permission check with permission granted", async () => {
      await testing.access.addMember(adminRoleData.id, ROLE_MEMBER);
      const permission = await testing.access.for(ROLE_CONTAINER, "users").can(ROLE_MEMBER, "create");
      expect(permission.granted).toEqual(true);
    });

    it("should successfully remove members", async () => {
      await testing.access.delMember(adminRoleData.id, ROLE_MEMBER);
      await testing.access.delMember(userRoleData.id, ROLE_MEMBER);
      const roles = await testing.access.getRolesByMember(ROLE_MEMBER);
      expect(roles.length).toEqual(0);
    });
  });
});
