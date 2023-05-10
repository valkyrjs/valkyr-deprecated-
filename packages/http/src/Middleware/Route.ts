import type { IncomingMessage, ServerResponse } from "http";

import { HttpError, HttpRedirect, HttpSuccess } from "../Lib/Response";
import type { Router } from "../Lib/Router";
import type { Middleware } from "../Types";

/*
 |--------------------------------------------------------------------------------
 | Route
 |--------------------------------------------------------------------------------
 */

export function route(router: Router): Middleware {
  return async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const result = await router.resolve(req);
      switch (result.status) {
        case "success": {
          handleResponse(res, result);
          break;
        }
        case "redirect": {
          handleRedirect(res, result);
          break;
        }
        case "error": {
          handleError(res, result);
          break;
        }
      }
    } catch (error: any) {
      if (error instanceof HttpError) {
        handleResponse(res, error);
      } else {
        handleResponse(res, new HttpError(500, "Internal server error", error));
      }
    } finally {
      res.end();
    }
  };
}

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

function handleRedirect(res: ServerResponse, result: HttpRedirect): void {
  res.writeHead(result.code, { location: result.url });
}

function handleError(res: ServerResponse, result: HttpError): void {
  if (result.code === 500) {
    console.log(result);
  }
  handleResponse(res, result);
}

function handleResponse(res: ServerResponse, result: HttpSuccess | HttpError): void {
  res.setHeader("Content-Type", "application/json");
  res.statusCode = result.code;
  res.write(JSON.stringify(result.toJSON()));
}
