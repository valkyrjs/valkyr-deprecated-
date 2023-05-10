import * as http from "http";

import { Middleware } from "../Types";

/*
 |--------------------------------------------------------------------------------
 | Request Listener
 |--------------------------------------------------------------------------------
 */

export function getRequestListener(middleware: Middleware[] = []): http.RequestListener {
  return async function (req: http.IncomingMessage, res: http.ServerResponse) {
    for (const handle of middleware) {
      if (res.headersSent) {
        return; // request has been ended ...
      }
      await handle(req, res);
    }
    if (!res.headersSent) {
      return res.end();
    }
  };
}
