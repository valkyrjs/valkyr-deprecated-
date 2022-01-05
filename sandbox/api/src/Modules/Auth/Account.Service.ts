import { nanoid } from "nanoid";
import * as stores from "stores";

import { collection } from "../../Collections";
import { store } from "../../Providers/EventStore";
import { reducer } from "./Account.Reducer";

/*
 |--------------------------------------------------------------------------------
 | Create
 |--------------------------------------------------------------------------------
 */

export async function create(email: string) {
  const accountId = nanoid();

  const state = await store.reduce(accountId, reducer);
  if (state) {
    throw new Error("Account already exists");
  }

  await store.insert(accountId, stores.account.created({ data: { email } }));

  return getByEmail(email);
}

export async function activate(accountId: string) {
  const state = await store.reduce(accountId, reducer);
  if (!state) {
    throw new Error("Account not found");
  }
  if (state.status === "active") {
    throw new Error("Account is already active");
  }
  await store.insert(accountId, stores.account.activated({}));
}

/*
 |--------------------------------------------------------------------------------
 | Read
 |--------------------------------------------------------------------------------
 */

export async function getByEmailOrCreate(email: string) {
  const account = await getByEmail(email);
  if (account) {
    return account;
  }
  return create(email);
}

export async function getByUsername(username: string) {
  return collection.accounts.findOne({ username });
}

export async function getByEmail(email: string) {
  return collection.accounts.findOne({ email });
}
