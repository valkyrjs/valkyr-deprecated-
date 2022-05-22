import { Menu } from "@valkyr/tailwind";

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
