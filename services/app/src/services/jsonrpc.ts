import { makeRequestFactory, ws } from "@valkyr/app";
import { JsonRpcClientMethods, methods } from "api/types";

export const client: JsonRpcClientMethods = Object.keys(methods).reduce((client, method) => {
  client[method] = makeRequestFactory(method, ws);
  return client;
}, {} as JsonRpcClientMethods);
