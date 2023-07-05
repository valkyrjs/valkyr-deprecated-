import { Id, InvalidRequestError, Params } from "@valkyr/jsonrpc";

export function validateRequest(request: RequestCandidate): void {
  if (request.jsonrpc !== "2.0") {
    throw new InvalidRequestError({
      reason: "Malformed or missing 'jsonrpc' in request",
      expected: {
        jsonrpc: "2.0"
      },
      received: request
    });
  }
  if (typeof request.method !== "string") {
    throw new InvalidRequestError({
      reason: "Malformed or missing 'method' in request",
      expected: {
        method: "typeof string"
      },
      received: request
    });
  }
  if (request.id !== undefined && typeof request.id !== "string" && typeof request.id !== "number") {
    throw new InvalidRequestError({
      reason: "Malformed 'id' in request",
      expected: {
        id: "typeof string | number"
      },
      received: request
    });
  }
}

type RequestCandidate = {
  jsonrpc?: "2.0";
  method?: string;
  params?: Params;
  id?: Id;
};
