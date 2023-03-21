import { Action } from "@valkyr/router";

import { auth } from "~Services/Auth";

export function isSignedIn(): Action {
  return async function () {
    return auth.isValid === false ? this.accept() : this.redirect("/");
  };
}
