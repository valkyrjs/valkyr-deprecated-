import { RpcError } from "./Errors";

export type Response = {
  /**
   * A String specifying the version of the JSON-RPC protocol. MUST be exactly "2.0".
   */
  jsonrpc: "2.0";

  /**
   * It MUST be the same as the value of the id member in the Request Object. If
   * there was an error in detecting the id in the Request object (e.g. Parse
   * error/Invalid Request), it MUST be Null.
   */
  id: string | number | null;
};

export type SuccessResponse<Result = void> = Response & {
  result: Result;
};

export type ErrorResponse = Response & {
  error: RpcError;
};
