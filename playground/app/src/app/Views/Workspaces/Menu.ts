import type { MenuCategory, MenuItem } from "../../Shared/Layout";

export function getHeaderMenu(): MenuItem[] {
  return [
    {
      type: "link",
      icon: "home",
      name: "Home",
      isActive: true,
      href: "/workspaces"
    }
  ];
}

export function getMainMenu(): MenuCategory[] {
  return [
    {
      name: "Workspaces",
      items: [
        {
          type: "link",
          icon: "workspace",
          name: "My workspaces",
          isActive: false,
          href: "/workspaces"
        },
        {
          type: "link",
          icon: "users",
          name: "Shared with you",
          isActive: false,
          href: "/workspaces"
        },
        {
          type: "link",
          name: "Invites",
          icon: "mail",
          isActive: false,
          href: "/workspaces"
        },
        {
          type: "link",
          name: "Archived",
          icon: "trash",
          isActive: false,
          href: "/workspaces"
        }
      ]
    }
  ];
}

export function getFooterMenu(): MenuCategory[] {
  return [
    {
      name: "Sandbox",
      items: [
        {
          type: "link",
          icon: "text-edit",
          name: "Text Editor",
          isActive: false,
          href: "/editor"
        },
        {
          type: "link",
          icon: "design",
          name: "Design System",
          isActive: false,
          href: "/ui"
        }
      ]
    }
  ];
}
