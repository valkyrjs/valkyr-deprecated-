import { container } from "@valkyr/access";

import { getAccountAttributes } from "./Attributes";

export async function setup(accountId: string, db = container.get("Database")): Promise<void> {
  await db.addRole({
    roleId: accountId,
    name: "Account",
    settings: {},
    permissions: {
      account: {
        setAlias: true,
        setName: true,
        setEmail: true,
        read: getAccountAttributes().enable(["accountId", "name", "alias", "email", "status"]).toNumber()
      }
    },
    members: [accountId]
  });
}
