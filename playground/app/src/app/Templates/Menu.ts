import { Menu } from "@valkyr/angular";

export function getMainMenu(workspaceId: string): Menu {
  return new Menu({
    categories: [
      {
        name: "Filters",
        items: []
      }
    ],
    params: {
      workspaceId
    }
  });
}

export function getFooterMenu(workspaceId: string): Menu {
  return new Menu({
    categories: [
      {
        name: "Actions",
        items: []
      }
    ],
    params: {
      workspaceId
    }
  });
}
