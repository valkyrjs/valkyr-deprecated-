import { projection } from "@valkyr/ledger";
import type {
  AccountActivated,
  AccountAliasSet,
  AccountClosed,
  AccountCreated,
  AccountEmailSet,
  AccountNameSet
} from "stores";
import { access } from "stores";

import { collection } from "../Collections";

projection.on<AccountCreated>("AccountCreated", async ({ entityId, data: { email } }) => {
  await collection.accounts.insertOne({
    accountId: entityId,
    status: "onboarding",
    alias: "",
    name: {
      family: "",
      given: ""
    },
    email,
    token: ""
  });
  await access.account.setup(entityId);
});

projection.on<AccountActivated>("AccountActivated", async ({ entityId }) => {
  console.log("ACCOUNT ACTIVATED", entityId);
  await collection.accounts.updateOne({ accountId: entityId }, { $set: { status: "active" } });
});

projection.on<AccountAliasSet>("AccountAliasSet", async ({ entityId, data: { alias } }) => {
  await collection.accounts.updateOne({ accountId: entityId }, { $set: { alias } });
});

projection.on<AccountNameSet>("AccountNameSet", async ({ entityId, data: { name } }) => {
  await collection.accounts.updateOne({ accountId: entityId }, { $set: { name } });
});

projection.on<AccountEmailSet>("AccountEmailSet", async ({ entityId, data: { email } }) => {
  await collection.accounts.updateOne({ accountId: entityId }, { $set: { email } });
});

projection.on<AccountClosed>("AccountClosed", async ({ entityId }) => {
  await collection.accounts.updateOne({ accountId: entityId }, { $set: { status: "closed" } });
});
