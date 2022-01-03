import { container } from "../../src/Container";
import { TestRole } from "./Lib/TestRole";
import { TestDatabase } from "./Providers/TestDatabase";

export function createMockDatabase() {
  const db = container.set("Database", new TestDatabase()).get("Database");
  db.store.push(
    new TestRole({
      roleId: "role-1",
      tenantId: "tenant-1",
      name: "Administrator",
      settings: {},
      permissions: {},
      members: []
    }).toJSON(),
    new TestRole({
      roleId: "role-2",
      tenantId: "tenant-1",
      name: "User",
      settings: {},
      permissions: {},
      members: []
    }).toJSON(),
    new TestRole({
      roleId: "role-3",
      tenantId: "tenant-2",
      name: "Administrator",
      settings: {},
      permissions: {},
      members: []
    }).toJSON()
  );
  return db;
}
