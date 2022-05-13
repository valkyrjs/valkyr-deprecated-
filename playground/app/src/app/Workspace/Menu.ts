import { Menu } from "@valkyr/angular";

export function getMainMenu(workspaceId: string): Menu {
  return new Menu({
    categories: [
      {
        name: "Workspace",
        items: [
          {
            name: "Dashboard",
            href: "/workspaces/{{workspaceId}}"
          },
          {
            name: "Todos",
            href: "/workspaces/{{workspaceId}}/todos"
          }
        ]
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
        items: [
          {
            name: "Design",
            href: "/workspaces/{{workspaceId}}/edit"
          }
        ]
      }
    ],
    params: {
      workspaceId
    }
  });
}
