import { Menu } from "@valkyr/angular";

export const menus: Record<string, Menu> = {
  sidebar: {
    id: "workspace-sidebar",
    type: "default",
    area: "sidebar-left-main",
    categories: [
      {
        name: "Workspaces",
        items: [
          {
            name: "My Workspaces",
            href: "/workspaces"
          },
          {
            name: "Shared Workspaces",
            href: "/workspaces?owner=false"
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
    ]
  }
};
