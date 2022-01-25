import { Action } from "@valkyr/router";

import { setPageTitle } from "../../utils/dom";

export function render(components: any[], title: string): Action {
  return async function () {
    setPageTitle(title);
    return this.render(components);
  };
}
