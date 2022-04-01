import {
  Attributes,
  createPermission,
  getPermissions,
  permissionGranted,
  PermissionHandler,
  Role
} from "@valkyr/access";

/*
 |--------------------------------------------------------------------------------
 | Bitflags
 |--------------------------------------------------------------------------------
 */

export const ACCOUNT_FLAGS: Record<string, number> = {
  id: 1 << 0,
  status: 1 << 1,
  alias: 1 << 2,
  name: 1 << 3,
  email: 1 << 4,
  token: 1 << 5
};

/*
 |--------------------------------------------------------------------------------
 | Role
 |--------------------------------------------------------------------------------
 */

export class AccountRole extends Role<{
  account: {
    setAlias: boolean;
    setEmail: boolean;
    setName: boolean;
    read: number; // bitflag value
    close: boolean;
  };
}> {
  public static getAttributes(flag?: number) {
    return new Attributes(ACCOUNT_FLAGS, flag);
  }

  public static getPermissions({ account }: Partial<AccountRole["permissions"]>): AccountRole["permissions"] {
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
}

/*
 |--------------------------------------------------------------------------------
 | Access
 |--------------------------------------------------------------------------------
 */

export const access = {
  setup: async (accountId: string) => {
    await createAccountRole(accountId);
  },
  for: createPermission<AccountRole["permissions"]>(),
  permissions: getPermissions<AccountRole["permissions"]>(),
  read
};

async function createAccountRole(accountId: string) {
  await AccountRole.create({
    tenantId: accountId,
    name: "Owner",
    permissions: {
      account: {
        setAlias: true,
        setName: true,
        setEmail: true,
        read: AccountRole.getAttributes().enable(["id", "name", "alias", "email", "status"]).toNumber()
      }
    },
    members: [accountId]
  });
}

/*
 |--------------------------------------------------------------------------------
 | Handlers
 |--------------------------------------------------------------------------------
 */

export function read(): PermissionHandler<AccountRole["permissions"]["account"]["read"]> {
  return (flag) => permissionGranted(AccountRole.getAttributes(flag));
}
