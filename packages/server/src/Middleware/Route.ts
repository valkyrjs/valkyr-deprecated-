import type { IncomingMessage, ServerResponse } from "http";

import { resolve } from "../Http/Request";
import { HttpError, HttpRedirect, HttpSuccess } from "../Http/Response";
import type { Server } from "../Server";
import type { Middleware } from "./Types";

/*
 |--------------------------------------------------------------------------------
 | Route
 |--------------------------------------------------------------------------------
 */

export function route(server: Server): Middleware {
  return async (req: IncomingMessage, res: ServerResponse) => {
    try {
      await handleRequest(server, req, res);
    } catch (err) {
      if (err instanceof HttpError) {
        handleResponse(res, err);
      } else {
        handleResponse(res, new HttpError(500, "Internal server error", err));
      }
      console.log(err);
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

async function handleRequest(server: Server, req: IncomingMessage, res: ServerResponse): Promise<void> {
  const result = await resolve(server.routes, req);
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
}

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
