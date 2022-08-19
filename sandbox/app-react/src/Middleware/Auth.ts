import { auth } from "@App/Services/Auth";
import { Action } from "@valkyr/router";

export function isAuthorized(): Action {
  return async function () {
    return auth.isAuthenticated() ? this.accept() : this.redirect("/signin");
  };
}
