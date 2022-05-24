import type { MenuCategory, MenuItem } from "../../Library/Layout";

export function getWorkspaceMainMenu(workspaceId: string): MenuCategory[] {
  return [
    {
      name: "Areas",
      items: [
        {
          type: "link",
          name: "Templates",
          icon: "template",
          href: `/workspaces/${workspaceId}/templates`
        },
        {
          type: "link",
          name: "Todo",
          href: `/workspaces/${workspaceId}/todos`
        }
      ]
    }
  ];
}

export function getHeaderMenu(): MenuItem[] {
  return [
    {
      type: "link",
      icon: "home",
      name: "Home",
      href: "/workspaces"
    }
  ];
}

export function getWorkspaceFooterMenu(workspaceId: string): MenuCategory[] {
  return [
    {
      name: "Actions",
      items: [
        {
          type: "link",
          name: "Design",
          href: `/workspaces/${workspaceId}}/edit`
        }
      ]
    }
  ];
}

export function getMainMenu(): MenuCategory[] {
  return [
    {
      name: "Main",
      showLabel: false,
      items: [
        {
          type: "link",
          icon: "home",
          name: "Home",
          href: "/workspaces"
        }
      ]
    },
    {
      name: "Workspaces",
      items: [
        {
          type: "link",
          icon: "workspace",
          name: "My workspaces",
          href: "/workspaces"
        },
        {
          type: "link",
          icon: "users",
          name: "Shared with you",
          href: "/workspaces"
        },
        {
          type: "link",
          name: "Invites",
          icon: "mail",
          href: "/workspaces"
        },
        {
          type: "link",
          name: "Archived",
          icon: "trash",
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
          href: "/editor"
        },
        {
          type: "link",
          icon: "design",
          name: "Design System",
          href: "/ui"
        }
      ]
    }
  ];
}
