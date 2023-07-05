import { RpcError } from "@valkyr/jsonrpc";
import type { WebSocket } from "ws";

/*
 |--------------------------------------------------------------------------------
 | Response
 |--------------------------------------------------------------------------------
 |
 | Simplify the response object by providing a function to create the response
 | format returned as part of request actions.
 |
 */

export const response = {
  accept(params = {}): Accept {
    return {
      status: "accept",
      params
    };
  },
  reject(error: RpcError): Reject {
    return {
      status: "reject",
      error
    };
  }
};

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type Action<P extends Record<string, unknown> = {}> = (
  req: Partial<Context>,
  res: Response<P>
) => Promise<Accept<P> | Reject> | (Accept<P> | Reject);

export interface Context {
  headers: {
    authorization?: string;
  };
  socket: WebSocket;
}

type Response<P extends Record<string, unknown> = Empty> = P extends Empty
  ? {
      accept(): Accept;
      reject(error: RpcError): Reject;
    }
  : {
      accept(params: P): Accept<P>;
      reject(error: RpcError): Reject;
    };

type Accept<P extends Record<string, unknown> = Record<string, unknown>> = {
  status: "accept";
  params: {
    [K in keyof P]: P[K];
  };
};

type Reject = {
  status: "reject";
  error: RpcError;
};

type Empty = Record<string, never>;
