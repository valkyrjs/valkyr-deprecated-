import { On, Projector } from "@valkyr/client";
import type { AccountStore } from "stores";

import { Account } from "./Model";

@Projector()
export class AccountProjector {
  @On("AccountCreated")
  public async created({ streamId, data: { email } }: AccountStore.Created) {
    await Account.insertOne({
      id: streamId,
      email
    });
  }

  @On("AccountNameSet")
  public async nameSet({ streamId, data: { name } }: AccountStore.NameSet) {
    await Account.updateOne(
      {
        id: streamId
      },
      {
        $set: {
          name
        }
      }
    );
  }
}
