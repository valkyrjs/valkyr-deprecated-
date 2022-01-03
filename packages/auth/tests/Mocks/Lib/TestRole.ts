import { container } from "../../../src/Container";
import { Role } from "../../../src/Lib/Role";

export class TestRole extends Role<{
  test?: {
    create?: boolean;
    edit?: boolean;
    delete?: boolean;
  };
}> {
  public static async get(roleId: string, db = container.get("Database")) {
    const role = await db.getRole(roleId);
    if (role) {
      return new this(role);
    }
  }
}
