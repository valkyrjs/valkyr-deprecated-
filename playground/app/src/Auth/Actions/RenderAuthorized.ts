import { setPageTitle } from "@valkyr/client";
import { Action } from "@valkyr/react";

import { config } from "~Config";

import { Auth } from "../Page";

export function renderAuthorized(components: any[], title: string): Action {
  return async function () {
    if (!localStorage.getItem("token")) {
      setPageTitle(config.app.name, "Authorize");
      return this.render([Auth]);
    }
    setPageTitle(config.app.name, title);
    return this.render(components);
  };
}
