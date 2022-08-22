import { Action } from "@valkyr/router";

export function render(components: any[], title: string): Action {
  return async function () {
    setPageTitle(title);
    return this.render(components);
  };
}

function setPageTitle(title: string): void {
  document.title = `Valkyr | ${title}`;
}
