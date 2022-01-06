import { nanoid } from "nanoid";
import * as stores from "stores";
import { Account } from "stores";

import { collection } from "../../../Collections";
import { store } from "../../../Providers/EventStore";
import { reducers } from "../Reducers";

/*
 |--------------------------------------------------------------------------------
 | Write
 |--------------------------------------------------------------------------------
 */

export async function create(email: string) {
  const accountId = nanoid();

  const state = await store.reduce(accountId, reducers.account);
  if (state) {
    throw new Error("Account already exists");
  }

  await store.insert(accountId, stores.account.created({ data: { email } }));

  return getByEmail(email);
}

export async function activate(accountId: string) {
  const state = await getAccountState(accountId);
  if (state.status === "active") {
    throw new Error("Account is already active");
  }
  await store.insert(accountId, stores.account.activated({}));
}

export async function name(accountId: string, name: Account["name"]) {
  const state = await getAccountState(accountId);
  if (state.name === name) {
    throw new Error("Name is already set");
  }
  await store.insert(accountId, stores.account.nameSet({ data: { name } }));
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

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

async function getAccountState(accountId: string) {
  const state = await store.reduce(accountId, reducers.account);
  if (state === undefined) {
    throw new Error("Account not found");
  }
  return state;
}
