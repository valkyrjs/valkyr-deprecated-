import { Menu } from "@valkyr/angular";

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
