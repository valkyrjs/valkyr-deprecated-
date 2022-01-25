import { createMockDatabase } from "./Mocks/Database";
import { getTestRole } from "./Mocks/Lib/TestRole";

beforeEach(() => {
  createMockDatabase();
});

describe("Role", () => {
  describe("when .get is used", () => {
    it("should successfully successfully get role", async () => {
      expect(await getTestRole("role-1")).toBeDefined();
      expect(await getTestRole("role-0")).toBeUndefined();
    });
  });

  describe("when .grant is used", () => {
    it("should successfully add new permissions", async () => {
      const role = await getTestRole("role-1");
      if (role) {
        await role.grant("test", "create").commit();
      }
      return expect(getTestRole("role-1").then((role) => role?.permissions)).resolves.toEqual({
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
      const role = await getTestRole("role-1");
      if (role) {
        await role.grant("test", "create").grant("test", "delete").commit();
        await role.deny("test", "delete").commit();
      }
      return expect(getTestRole("role-1").then((role) => role?.permissions)).resolves.toEqual({
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
      const role = await getTestRole("role-1");
      if (role) {
        await role.addMember("member-1");
      }
      return expect(getTestRole("role-1").then((role) => role?.members)).resolves.toEqual(["member-1"]);
    });
  });

  describe("when .delMember is used", () => {
    it("should successfully delete member", async () => {
      const role = await getTestRole("role-1");
      if (role) {
        await role.addMember("member-1");
        await role.delMember("member-1");
      }
      return expect(getTestRole("role-1").then((role) => role?.members)).resolves.toEqual([]);
    });
  });
});
