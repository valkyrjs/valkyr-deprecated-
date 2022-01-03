import { TestRole } from "./Mocks/TestRole";

let role: TestRole;

beforeEach(async () => {
  role = new TestRole({
    tenantId: "xyz",
    roleId: "abc",
    name: "Owner",
    settings: {},
    permissions: {
      test: {
        create: false,
        edit: false,
        delete: false
      }
    },
    members: []
  });
});

describe("Role", () => {
  describe("when .grant is used", () => {
    it("should generate new permission operations", async () => {
      expect(role.grant("test", "create").operations).toEqual([
        { action: "create", data: true, resource: "test", type: "set" }
      ]);
    });
  });

  describe("when .deny is used", () => {
    it("should generate new permission operations", async () => {
      expect(role.deny("test", "create").operations).toEqual([{ action: "create", resource: "test", type: "unset" }]);
    });
  });
});
