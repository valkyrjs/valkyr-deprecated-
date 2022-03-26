import "./Routes";

import { ledger } from "@valkyr/ledger-client";

import { resolve } from "./Modules/Auth";
import { adapter } from "./Providers/IdbAdapter";
import { socket } from "./Providers/Socket";

/*
 |--------------------------------------------------------------------------------
 | Setup
 |--------------------------------------------------------------------------------
 */

export async function setup(): Promise<void> {
  await socket.connect();
  await ledger.setup(socket, adapter);
  await dependencies();
  await event();
  await auth();
}

async function dependencies(): Promise<void> {
  await Promise.all([import("./Providers/Auth")]);
}

async function event() {
  await Promise.all([import("./Projections/Account"), import("./Projections/Workspace")]);
}

async function auth() {
  const token = localStorage.getItem("token");
  if (token) {
    await resolve(token);
  }
}
