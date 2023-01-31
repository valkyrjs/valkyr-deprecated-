import { AccessService, Role } from "~services/access";

import { AccountRole, role } from "./account.role";

class AccountAccess extends AccessService<Permissions> {
  #permissions: Permissions = {
    realm: {
      create: false
    }
  };

  reduce(roles: Role<Permissions>[]): Permissions {
    return roles.reduce<Permissions>(
      (state, { permissions }) => AccountRole.reduce(state, permissions),
      this.#permissions
    );
  }

  async createOwnerRole(accountId: string): Promise<void> {
    await this.addRole(accountId, role.owner(accountId));
  }
}

export const access = new AccountAccess();

type Permissions = AccountRole["permissions"];
