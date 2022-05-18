import { Menu } from "@valkyr/angular";

export function getMainMenu(workspaceId: string): Menu {
  return new Menu({
    categories: [
      {
        name: "Areas",
        items: [
          {
            type: "link",
            isActive: false,
            name: "Templates",
            icon: "template",
            href: "/workspaces/{{workspaceId}}/templates"
          },
          {
            type: "link",
            isActive: false,
            name: "Todo",
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
            type: "link",
            isActive: false,
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
