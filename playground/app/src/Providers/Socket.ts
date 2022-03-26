import { Socket } from "@valkyr/socket";

import { config } from "../Config";

/*
 |--------------------------------------------------------------------------------
 | Socket
 |--------------------------------------------------------------------------------
 */

export const socket = new Socket({
  uri: config.socket
});

/*
 |--------------------------------------------------------------------------------
 | Debug
 |--------------------------------------------------------------------------------
 */

declare global {
  interface Window {
    socket: Socket;
  }
}

if (global.window !== undefined) {
  window.socket = socket;
}
