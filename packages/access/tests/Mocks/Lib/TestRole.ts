import { container } from "../../../src/Container";
import { Role } from "../../../src/Role";

export type Permissions = {
  test: {
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
};

export async function getTestRole(roleId: string, db = container.get("Database")) {
  const data = await db.getRole<Permissions>(roleId);
  if (data) {
    return new Role<Permissions>({
      ...data,
      permissions: getPermissions(data.permissions)
    });
  }
}

function getPermissions({ test }: Partial<Permissions>): Permissions {
  return {
    test: {
      create: test?.create === true,
      edit: test?.edit === true,
      delete: test?.delete === true
    }
  };
}
