import * as http from "http";

import { Middleware } from "../Types";
import { getRequestListener } from "./Listener";

/*
 |--------------------------------------------------------------------------------
 | Server
 |--------------------------------------------------------------------------------
 */

export function server(middleware: Middleware[] = []): http.Server {
  return http.createServer(getRequestListener(middleware));
}
