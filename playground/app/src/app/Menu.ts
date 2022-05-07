import { MenuSettings } from "@valkyr/angular";
import { dot } from "@valkyr/utils";

export const MENU_AREA_SIDEBAR = "MENU_AREA_SIDEBAR";

export const cached: Record<string, MenuSettings[] | Record<string, MenuSettings[]>> = {
  workspace: {
    landing: [
      {
        id: "workspace:landing",
        area: MENU_AREA_SIDEBAR,
        categories: [
          {
            name: "Workspaces",
            items: [
              {
                name: "My Workspaces",
                href: "/workspaces/me"
              },
              {
                name: "Shared",
                href: "/workspaces/shared"
              },
              {
                name: "Invites",
                href: "/workspaces/invites"
              },
              {
                name: "Archived",
                href: "/workspaces/archived"
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
    ],
    dashboard: [
      {
        id: "workspace:dashboard",
        area: MENU_AREA_SIDEBAR,
        categories: [
          {
            items: [
              {
                name: "My Workspaces",
                href: "/workspaces"
              }
            ]
          },
          {
            name: "Workspace",
            items: [
              {
                name: "Dashboard",
                href: "/workspaces/{{id}}"
              },
              {
                name: "Todos",
                href: "/workspaces/{{id}}/todos"
              }
            ]
          }
        ]
      }
    ]
  },
  sandbox: [
    {
      id: "sandbox:text-editor",
      area: MENU_AREA_SIDEBAR,
      categories: [
        {
          name: "Workspaces",
          items: [
            {
              name: "My Workspaces",
              href: "/workspaces"
            }
          ]
        }
      ]
    }
  ]
};

export function getMenu(path: string): MenuSettings[] {
  return dot.getProperty(cached, path, []) as MenuSettings[];
}
