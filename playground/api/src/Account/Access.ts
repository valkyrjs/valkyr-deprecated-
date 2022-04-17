import { AccessService } from "@valkyr/nestjs";
import { AccountStore } from "stores";

export class AccountAccess extends AccessService<AccountStore.AccountRole["permissions"]> {
  public async createOwner(accountId: string) {
    await this.roles.create({
      tenantId: accountId,
      name: "Owner",
      permissions: {
        account: {
          setAlias: true,
          setName: true,
          setEmail: true,
          read: AccountStore.AccountRole.getAttributes().enable(["id", "name", "alias", "email", "status"]).toNumber()
        }
      },
      members: [accountId]
    });
  }
}
