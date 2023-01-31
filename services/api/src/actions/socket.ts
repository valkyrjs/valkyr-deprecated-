import { Action } from "@valkyr/api";
import { ServerError } from "@valkyr/jsonrpc";

export const isSocket: Action = async function (_, { socket }) {
  if (socket === undefined) {
    return this.reject(new ServerError(-32010, "Socket not available"));
  }
  return this.accept();
};
