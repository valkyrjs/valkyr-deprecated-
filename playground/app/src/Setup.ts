import { client } from "@valkyr/client";

import { adapter } from "~Library/Adapter";

import { config } from "./Config";

/*
 |--------------------------------------------------------------------------------
 | Setup
 |--------------------------------------------------------------------------------
 */

export async function setup(): Promise<void> {
  await client.setup({
    api: config.api.uri,
    socket: config.socket.uri,
    database: adapter
  });
}
