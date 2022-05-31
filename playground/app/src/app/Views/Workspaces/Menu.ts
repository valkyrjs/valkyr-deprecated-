import type { MenuCategory, MenuItem } from "../../Shared/Layout";

export function getWorkspaceMainMenu(workspaceName: string, workspaceId: string): MenuCategory[] {
  return [
    {
      name: workspaceName,
      items: [
        {
          type: "link",
          name: "Templates",
          icon: "template",
          isActive: false,
          href: `/workspaces/${workspaceId}/templates`
        },
        {
          type: "link",
          name: "Task Boards",
          icon: "tasks",
          isActive: false,
          href: `/boards`
        },
        {
          type: "link",
          name: "Invites",
          icon: "mail",
          isActive: false,
          href: `/workspaces/${workspaceId}/invites`
        }
      ]
    }
  ];
}

export function getWorkspaceHeaderMenu(workspaceName: string, workspaceId: string): MenuItem[] {
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
      name: workspaceName,
      isActive: false,
      href: `/workspaces/${workspaceId}`
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
          isActive: false,

          href: `/workspaces/${workspaceId}}/edit`
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
      isActive: false,
      href: "/workspaces"
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
          isActive: false,
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
