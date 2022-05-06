import { Menu } from "@valkyr/angular";

export const menus: Record<string, Menu> = {
  sidebar: {
    id: "workspace-sidebar",
    type: "default",
    area: "sidebar",
    categories: [
      {
        name: "Menu",
        items: [
          {
            name: "My Workspaces",
            href: "/workspaces"
          }
        ]
      },
      {
        name: "Sandbox",
        items: [
          {
            name: "Text Editor",
            href: "/editor"
          }
        ]
      }
    ],
    items: []
  }
};
