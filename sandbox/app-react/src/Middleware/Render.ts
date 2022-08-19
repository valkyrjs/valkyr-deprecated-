import { setPageTitle } from "@App/Utils/Dom";
import { Action } from "@valkyr/router";

export function render(components: any[], title: string): Action {
  return async function () {
    setPageTitle(title);
    return this.render(components);
  };
}
