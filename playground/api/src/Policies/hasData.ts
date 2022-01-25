import { WsAction } from "@valkyr/server";

/*
 |--------------------------------------------------------------------------------
 | Policies
 |--------------------------------------------------------------------------------
 */

export function hasData(keys: string[]): WsAction {
  return async function (_, data) {
    const missing: string[] = [];
    for (const key of keys) {
      if (data[key] === undefined) {
        missing.push(key);
      }
    }
    if (missing.length) {
      return this.reject(400, `Socket Message Violation: Missing required keys '${missing.join(", ")}' in data`);
    }
    return this.accept();
  };
}
