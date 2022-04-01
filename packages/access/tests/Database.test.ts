import { MongoDbTestContainer } from "@valkyr/testing";

import { access } from "../src";
import { db } from "../src/Database";
import { Operation } from "../src/RolePermission";

const role1 = {
  tenantId: "tenant-1",
  roleId: "role-1",
  name: "Role #1",
  settings: {},
  permissions: {},
  members: ["member-1"]
};

const role2 = {
  tenantId: "tenant-1",
  roleId: "role-2",
  name: "Role #2",
  settings: {},
  permissions: {},
  members: ["member-1"]
};

let container: MongoDbTestContainer;
let operation: Operation<any, any>;

beforeEach(async () => {
  container = await MongoDbTestContainer.start();
  await access.setup(container.db);
});

afterEach(async () => {
  container.stop();
});

describe("roles", () => {
  it("should insert and find role", async () => {
    await db.addRole(role1);
    await expect(db.getRole("role-1")).resolves.toStrictEqual(role1);
    await expect(db.getRole("none-1")).resolves.toStrictEqual(null);
  });
});

describe("permissions", () => {
  it("should upsert permissions", async () => {
    await db.addRole(role2);

    operation = {
      type: "set",
      resource: "default",
      action: "create",
      data: {
        foo: "bar"
      }
    };

    await db.setPermissions("role-2", [operation]);
    await expect(db.getPermissions("member-1")).resolves.toStrictEqual({
      default: {
        create: {
          foo: "bar"
        }
      }
    });

    operation = {
      type: "unset",
      resource: "default",
      action: "create"
    };

    await db.setPermissions("role-2", [operation]);
    await expect(db.getPermissions("member-1")).resolves.toStrictEqual({ default: {} });

    operation = {
      type: "unset",
      resource: "default"
    };

    await db.setPermissions("role-2", [operation]);
    await expect(db.getPermissions("member-1")).resolves.toStrictEqual({});
  });
});

describe("members", () => {
  it("should add member", async () => {
    await db.addRole(role1);
    await db.addMember("role-1", "member-2");
    await expect(db.getRole("role-1")).resolves.toStrictEqual({
      ...role1,
      members: ["member-1", "member-2"]
    });
  });

  it("should remove member", async () => {
    await db.addRole(role1);
    await db.delMember("role-1", "member-1");
    await expect(db.getRole("role-1")).resolves.toStrictEqual({
      ...role1,
      members: []
    });
  });
});
