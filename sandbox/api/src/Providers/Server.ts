import { Auth } from "@valkyr/auth";
import { Server } from "@valkyr/server";

import { auth } from "../Middleware/Auth";

/*
 |--------------------------------------------------------------------------------
 | Module Extension
 |--------------------------------------------------------------------------------
 */

declare module "@valkyr/server" {
  interface Client {
    auth: Auth;
  }
}

/*
 |--------------------------------------------------------------------------------
 | Server
 |--------------------------------------------------------------------------------
 */

export const server = new Server({
  middleware: [auth],
  connected: (client) => {
    client.auth = Auth.guest();
  }
});

export const route = server.route;
