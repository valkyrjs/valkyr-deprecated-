import "./Routes";

import { ledger } from "@valkyr/client";

import { auth } from "./Auth";
import { adapter, data, socket } from "./Data";

/*
 |--------------------------------------------------------------------------------
 | Setup
 |--------------------------------------------------------------------------------
 */

export async function setup(): Promise<void> {
  await socket.connect();
  await ledger.setup(socket, adapter);
  await data.setup();
  await auth.setup();
}
