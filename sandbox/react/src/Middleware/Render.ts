import { Action } from "@valkyr/router";

export function render(components: any[]): Action {
  return async function ({ route }) {
    setPageTitle(route.name);
    return this.render(components);
  };
}

function setPageTitle(title = "Untitled"): void {
  document.title = `Valkyr | ${title}`;
}
