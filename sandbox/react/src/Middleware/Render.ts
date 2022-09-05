import { Action } from "@valkyr/router";

export function render(components: unknown): Action {
  return async function ({ route }) {
    setPageTitle(route.name);
    return this.render(components);
  };
}

function setPageTitle(title = "Untitled"): void {
  document.title = `Valkyr | ${title}`;
}
