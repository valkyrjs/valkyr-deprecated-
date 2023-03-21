import { Action } from "@valkyr/router";

import { auth } from "~Services/Auth";

export function isAuthenticated(): Action {
  return async function () {
    return auth.isValid === true ? this.accept() : this.redirect("/signin");
  };
}
