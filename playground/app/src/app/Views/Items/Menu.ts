import type { MenuCategory, MenuItem } from "../../Shared/Layout";

export function getHeaderMenu(workspaceName: string): MenuItem[] {
  return [
    {
      type: "link",
      icon: "home",
      name: "Home",
      isActive: false,
      href: "/workspaces"
    },
    {
      type: "link",
      icon: "template",
      isActive: true,
      name: workspaceName,
      href: `/`
    }
  ];
}

export function getMainMenu(workspaceName: string, activeRoute: string): MenuCategory[] {
  return [
    {
      name: workspaceName,
      items: [
        {
          type: "link",
          name: "Dashboard",
          icon: "template",
          isActive: false,
          href: `/`
        },
        {
          type: "link",
          name: "Board",
          icon: "tasks",
          isActive: true,
          href: `/boards`
        },
        {
          type: "link",
          name: "Invites",
          icon: "mail",
          isActive: false,
          href: `/invites`
        }
      ]
    },
    {
      name: "Filters",
      items: [
        {
          type: "link",
          name: "My items",
          icon: "tasks",
          isActive: activeRoute === "/boards?assignee=me",
          href: "/boards?assignee=me"
        },
        {
          type: "link",
          name: "Created by me",
          icon: "tasks",
          isActive: activeRoute === "/boards?createdBy=me",
          href: "/boards?createdBy=me"
        }
      ]
    }
  ];
}

export function getFooterMenu(workspaceName: string): MenuCategory[] {
  return [];
}
