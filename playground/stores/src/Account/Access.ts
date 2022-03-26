import { Attributes, container, createPermission, permissionGranted, PermissionHandler, Role } from "@valkyr/access";
import { nanoid } from "@valkyr/utils";

import type { Account } from "./Aggregate";

/*
 |--------------------------------------------------------------------------------
 | Access
 |--------------------------------------------------------------------------------
 */

export const access = {
  setup: async (accountId: string) => {
    await createAccountRole(accountId);
  },
  for: createPermission<Permissions>(),
  read
};

/*
 |--------------------------------------------------------------------------------
 | Role
 |--------------------------------------------------------------------------------
 */

export async function getAccountRole(roleId: string, db = container.get("Database")) {
  const data = await db.getRole<Permissions>(roleId);
  if (data) {
    return new Role<Permissions>({
      ...data,
      permissions: getPermissions(data.permissions)
    });
  }
}

async function createAccountRole(accountId: string, db = container.get("Database")): Promise<void> {
  await db.addRole({
    tenantId: accountId,
    roleId: nanoid(),
    name: "Owner",
    settings: {},
    permissions: {
      account: {
        setAlias: true,
        setName: true,
        setEmail: true,
        read: getAccountAttributes().enable(["id", "name", "alias", "email", "status"]).toNumber()
      }
    },
    members: [accountId]
  });
}

/*
 |--------------------------------------------------------------------------------
 | Permissions
 |--------------------------------------------------------------------------------
 */

export type Permissions = {
  account: {
    setAlias: boolean;
    setEmail: boolean;
    setName: boolean;
    read: number; // bitflag value
    close: boolean;
  };
};

function getPermissions({ account }: Partial<Permissions>): Permissions {
  return {
    account: {
      setAlias: account?.setAlias === true,
      setName: account?.setAlias === true,
      setEmail: account?.setAlias === true,
      read: account?.read ?? 0,
      close: account?.close === true
    }
  };
}

/*
 |--------------------------------------------------------------------------------
 | Attributes
 |--------------------------------------------------------------------------------
 */

export const ACCOUNT_FLAGS: Record<keyof Account, number> = {
  id: 1 << 0,
  status: 1 << 1,
  alias: 1 << 2,
  name: 1 << 3,
  email: 1 << 4,
  token: 1 << 5
};

export function getAccountAttributes(flag?: number) {
  return new Attributes(ACCOUNT_FLAGS, flag);
}

/*
 |--------------------------------------------------------------------------------
 | Handlers
 |--------------------------------------------------------------------------------
 */

export function read(): PermissionHandler<Permissions["account"]["read"]> {
  return (flag) => permissionGranted(getAccountAttributes(flag));
}
