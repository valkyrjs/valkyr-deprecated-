import { Action } from "@valkyr/react";

import { Auth } from "../Pages/Auth";
import { setPageTitle } from "../Utils/Dom";

export function renderAuthorized(components: any[], title: string): Action {
  return async function () {
    if (!localStorage.getItem("token")) {
      setPageTitle("Authorize");
      return this.render([Auth]);
    }
    setPageTitle(title);
    return this.render(components);
  };
}
