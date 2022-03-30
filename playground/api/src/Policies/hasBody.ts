import { HttpAction } from "@valkyr/server";

/*
 |--------------------------------------------------------------------------------
 | Policies
 |--------------------------------------------------------------------------------
 */

export function hasBody(keys: string[]): HttpAction {
  return async function ({ body }) {
    const missing: string[] = [];
    for (const key of keys) {
      if (body[key] === undefined) {
        missing.push(key);
      }
    }
    if (missing.length) {
      return this.reject(400, `Http Request Violation: Missing required keys '${missing.join(", ")}' in body`);
    }
    return this.accept();
  };
}
