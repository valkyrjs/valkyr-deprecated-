import { container } from "../../src/Container";
import { Role } from "../../src/Role";
import { TestDatabase } from "./Providers/TestDatabase";

export function createMockDatabase() {
  const db = container.set("Database", new TestDatabase()).get("Database");

  db.addRole(
    new Role({
      roleId: "role-1",
      name: "Administrator",
      settings: {},
      permissions: {},
      members: []
    }).toJSON()
  );

  db.addRole(
    new Role({
      roleId: "role-2",
      name: "User",
      settings: {},
      permissions: {},
      members: []
    }).toJSON()
  );

  db.addRole(
    new Role({
      roleId: "role-3",
      name: "Administrator",
      settings: {},
      permissions: {},
      members: []
    }).toJSON()
  );

  return db;
}
