import { container, createAllFilter } from "@valkyr/access";

import { ACCOUNT_FLAGS } from "./Attributes";

export async function setup(accountId: string, db = container.get("Database")): Promise<void> {
  await db.addRole({
    roleId: accountId,
    tenantId: accountId,
    name: "Account",
    settings: {},
    permissions: {
      account: {
        setAlias: true,
        setName: true,
        setEmail: true,
        read: {
          owner: createAllFilter(ACCOUNT_FLAGS),
          admin:
            ACCOUNT_FLAGS.accountId |
            ACCOUNT_FLAGS.status |
            ACCOUNT_FLAGS.alias |
            ACCOUNT_FLAGS.name |
            ACCOUNT_FLAGS.email
        }
      }
    },
    members: [accountId]
  });
}
