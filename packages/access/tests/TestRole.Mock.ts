import { Role } from "../src/Role";

export class TestRole extends Role<TestRolePermissions> {
  static getPermissions({ test }: Partial<TestRole["permissions"]>): TestRole["permissions"] {
    return {
      test: {
        create: test?.create === true,
        edit: test?.edit === true,
        delete: test?.delete === true
      }
    };
  }
}

export type TestRolePermissions = {
  test: {
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
};
