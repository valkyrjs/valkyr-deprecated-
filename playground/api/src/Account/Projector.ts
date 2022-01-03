import { On, Projector } from "@valkyr/nestjs";
import { AccountStore } from "stores";

import { AccountAccess } from "./Access";
import { AccountService } from "./Services/Account";

@Projector()
export class AccountProjector {
  constructor(private readonly account: AccountService, private readonly access: AccountAccess) {}

  @On("AccountCreated")
  public async created({ streamId, data: { email } }: AccountStore.Created) {
    await Promise.all([
      this.account.create({
        id: streamId,
        status: "onboarding",
        alias: "",
        name: {
          family: "",
          given: ""
        },
        email,
        token: ""
      }),
      this.access.createOwner(streamId)
    ]);
  }

  @On("AccountActivated")
  public async activate({ streamId }: AccountStore.Activated) {
    await this.account.update(streamId, { status: "active" });
  }

  @On("AccountAliasSet")
  public async aliasSet({ streamId, data: { alias } }: AccountStore.AliasSet) {
    await this.account.update(streamId, { alias });
  }

  @On("AccountNameSet")
  public async nameSet({ streamId, data: { name } }: AccountStore.NameSet) {
    await this.account.update(streamId, { name });
  }

  @On("AccountEmailSet")
  public async emailSet({ streamId, data: { email } }: AccountStore.EmailSet) {
    await this.account.update(streamId, { email });
  }

  @On("AccountClosed")
  public async closed({ streamId }: AccountStore.Closed) {
    await this.account.update(streamId, { status: "closed" });
  }
}
