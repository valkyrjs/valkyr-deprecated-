import { Attributes, permissionGranted, PermissionHandler, Role } from "@valkyr/access";

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
 | Handlers
 |--------------------------------------------------------------------------------
 */

export function read(): PermissionHandler<AccountRole["permissions"]["account"]["read"]> {
  return (flag) => permissionGranted(AccountRole.getAttributes(flag));
}
