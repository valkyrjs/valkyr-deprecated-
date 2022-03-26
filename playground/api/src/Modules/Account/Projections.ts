import { projection } from "@valkyr/ledger-server";
import type {
  AccountActivated,
  AccountAliasSet,
  AccountClosed,
  AccountCreated,
  AccountEmailSet,
  AccountNameSet
} from "stores";
import { access } from "stores";

import { collection } from "../../Collections";

projection.on<AccountCreated>("AccountCreated", async ({ streamId, data: { email } }) => {
  await collection.accounts.insertOne({
    id: streamId,
    status: "onboarding",
    alias: "",
    name: {
      family: "",
      given: ""
    },
    email,
    token: ""
  });
  await access.account.setup(streamId);
});

projection.on<AccountActivated>("AccountActivated", async ({ streamId }) => {
  await collection.accounts.updateOne({ id: streamId }, { $set: { status: "active" } });
});

projection.on<AccountAliasSet>("AccountAliasSet", async ({ streamId, data: { alias } }) => {
  await collection.accounts.updateOne({ id: streamId }, { $set: { alias } });
});

projection.on<AccountNameSet>("AccountNameSet", async ({ streamId, data: { name } }) => {
  await collection.accounts.updateOne({ id: streamId }, { $set: { name } });
});

projection.on<AccountEmailSet>("AccountEmailSet", async ({ streamId, data: { email } }) => {
  await collection.accounts.updateOne({ id: streamId }, { $set: { email } });
});

projection.on<AccountClosed>("AccountClosed", async ({ streamId }) => {
  await collection.accounts.updateOne({ id: streamId }, { $set: { status: "closed" } });
});
