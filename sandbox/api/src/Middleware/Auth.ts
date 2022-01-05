import { Auth } from "@valkyr/auth";
import { HttpError, Middleware } from "@valkyr/server";
import { ServerResponse } from "http";

/*
 |--------------------------------------------------------------------------------
 | Module Extension
 |--------------------------------------------------------------------------------
 */

declare module "http" {
  interface IncomingMessage {
    auth: Auth;
  }
}

/*
 |--------------------------------------------------------------------------------
 | Middleware
 |--------------------------------------------------------------------------------
 */

export const auth: Middleware = async function (req, res) {
  if (req.headers.authorization) {
    try {
      req.auth = await Auth.resolve(req.headers.authorization);
    } catch (err) {
      sendUnauthorizedResponse(res, err);
    }
  } else {
    req.auth = await Auth.guest();
  }
};

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

function sendUnauthorizedResponse(res: ServerResponse, error: Error): void {
  res.statusCode = 401;
  res.setHeader("Content-Type", "application/json");
  res.write(JSON.stringify(new HttpError(401, "Unauthorized", { error })));
  res.end();
}
