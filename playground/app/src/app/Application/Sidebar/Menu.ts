export type Menu = MenuCategory[];

type MenuCategory = {
  name: string;
  items: MenuItem[];
};

type MenuItem = {
  name: string;
  href: string;
};

export const menu: Menu = [
  {
    name: "Menu",
    items: [
      {
        name: "My Workspaces",
        href: "/workspaces"
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
];
