import type { MenuCategory, MenuItem } from "../../Library/Layout";

export function getWorkspaceMainMenu(workspaceName: string, workspaceId: string): MenuCategory[] {
  return [
    {
      name: workspaceName,
      items: [
        {
          type: "link",
          name: "Templates",
          icon: "template",
          href: `/workspaces/${workspaceId}/templates`
        },
        {
          type: "link",
          name: "Task Boards",
          icon: "tasks",
          href: `/boards`
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
      href: "/workspaces"
    },
    {
      type: "link",
      icon: "template",
      name: workspaceName,
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
      href: "/workspaces"
    }
  ];
}

export function getMainMenu(workspaceId: string): MenuCategory[] {
  return [
    {
      name: "Main",
      showLabel: false,
      items: [
        {
          type: "link",
          icon: "home",
          name: "Home",
          href: `/workspaces/${workspaceId}`
        }
      ]
    },
    {
      name: "Task boards",
      items: [
        {
          type: "link",
          name: "Archived",
          icon: "trash",
          href: "/boards"
        }
      ]
    }
  ];
}

export function getFooterMenu(): MenuCategory[] {
  return [
    {
      name: "Actions",
      items: []
    }
  ];
}
