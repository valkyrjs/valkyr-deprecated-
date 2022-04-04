import "./Routes";

import { client } from "@valkyr/client";

import { config } from "./Config";
import { adapter, data } from "./Data";

/*
 |--------------------------------------------------------------------------------
 | Setup
 |--------------------------------------------------------------------------------
 */

export async function setup(): Promise<void> {
  await client.setup({
    api: config.api,
    socket: config.socket,
    database: adapter
  });
  await data.setup();
}
