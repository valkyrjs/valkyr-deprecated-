import { MongoDbTestContainer } from "./Mocks/Database";
import { TestRole } from "./Mocks/TestRole";

let container: MongoDbTestContainer;
let roleId: string;

beforeEach(async () => {
  container = await MongoDbTestContainer.start();
  roleId = await TestRole.create({
    tenantId: "tenant-1",
    name: "Administrator"
  });
});

afterEach(async () => {
  await container.stop();
});

describe("Role", () => {
  describe("when .get is used", () => {
    it("should successfully successfully get role", async () => {
      expect(await TestRole.for(roleId)).toBeDefined();
      expect(await TestRole.for("unknown-id")).toBeUndefined();
    });
  });

  describe("when .grant is used", () => {
    it("should successfully add new permissions", async () => {
      const role = await TestRole.for(roleId);
      if (role) {
        await role.grant("test", "create").commit();
      }
      return expect(TestRole.for(roleId).then((role) => role?.permissions)).resolves.toEqual({
        test: {
          create: true,
          edit: false,
          delete: false
        }
      });
    });
  });

  describe("when .deny is used", () => {
    it("should successfully remove permissions", async () => {
      const role = await TestRole.for(roleId);
      if (role) {
        await role.grant("test", "create").grant("test", "delete").commit();
        await role.deny("test", "delete").commit();
      }
      return expect(TestRole.for(roleId).then((role) => role?.permissions)).resolves.toEqual({
        test: {
          create: true,
          edit: false,
          delete: false
        }
      });
    });
  });

  describe("when .addMember is used", () => {
    it("should successfully add member", async () => {
      const role = await TestRole.for(roleId);
      if (role) {
        await role.addMember("member-1");
      }
      return expect(TestRole.for(roleId).then((role) => role?.members)).resolves.toEqual(["member-1"]);
    });
  });

  describe("when .delMember is used", () => {
    it("should successfully delete member", async () => {
      const role = await TestRole.for(roleId);
      if (role) {
        await role.addMember("member-1");
        await role.delMember("member-1");
      }
      return expect(TestRole.for(roleId).then((role) => role?.members)).resolves.toEqual([]);
    });
  });
});
