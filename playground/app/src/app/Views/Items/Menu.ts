import type { HeaderMenu, MenuCategory, MenuItem, Nav, Sidebar, Sidepane } from "../../Shared/Layout";

export function getHeaderMenu(workspaceName: string): HeaderMenu {
  return {
    isBordered: true,
    isVisible: true,
    menu: [
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
    ]
  };
}

export function getNav(title: string): Nav {
  return {
    isBordered: true,
    isVisible: true,
    title
  };
}

export function getSidebar(): Sidebar {
  return {
    isBordered: false,
    isVisible: false,
    menu: []
  };
}

export function getSidepane(workspaceName: string, activeRoute: string, actions: MenuItem[]): Sidepane {
  return {
    isBordered: true,
    isVisible: true,
    actions,
    homeMenu: [],
    mainMenu: getMainMenu(workspaceName, activeRoute),
    footerMenu: getFooterMenu(workspaceName)
  };
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
          isActive: activeRoute === "/",
          href: "/"
        },
        {
          type: "link",
          name: "Board",
          icon: "tasks",
          isActive: activeRoute === "/boards",
          href: "/boards"
        },
        {
          type: "link",
          name: "Invites",
          icon: "mail",
          isActive: activeRoute === "/invites",
          href: "/invites"
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
