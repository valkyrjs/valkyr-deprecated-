import { Attributes, Role, RoleSettings } from "@valkyr/access";
import { randomUUID } from "crypto";

/*
 |--------------------------------------------------------------------------------
 | Bitflags
 |--------------------------------------------------------------------------------
 */

export const IDENTITY_FLAGS: Record<string, number> = {
  id: 1 << 0,
  name: 1 << 1,
  email: 1 << 2,
  password: 1 << 3,
  key: 1 << 4
};

/*
 |--------------------------------------------------------------------------------
 | Role
 |--------------------------------------------------------------------------------
 */

export class AccountRole extends Role<{
  realm: {
    create: boolean;
  };
}> {
  static getAttributes(flag?: number) {
    return new Attributes(IDENTITY_FLAGS, flag);
  }

  static getPermissions({ realm }: Partial<AccountRole["permissions"]>): AccountRole["permissions"] {
    return {
      realm: {
        create: realm?.create === true
      }
    };
  }

  static reduce(
    state: AccountRole["permissions"],
    permissions: Partial<AccountRole["permissions"]>
  ): AccountRole["permissions"] {
    return {
      realm: {
        create: permissions.realm?.create === true || state.realm.create === true
      }
    };
  }
}

export const role = {
  owner: (accountId: string): RoleSettings<AccountRole["permissions"]> => ({
    id: randomUUID(),
    container: accountId,
    name: "Owner",
    settings: {},
    permissions: {
      realm: {
        create: true
      }
    },
    members: [accountId]
  })
};
