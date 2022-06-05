import { MenuCategory } from "./MenuCategory";
import { MenuItem } from "./MenuItem";

type LayoutArea = {
  isVisible: boolean;
  isBordered: boolean;
};

export type HeaderMenu = LayoutArea & {
  menu: MenuItem[];
};

export type Sidebar = LayoutArea & {
  menu: MenuItem[];
};

export type Sidepane = LayoutArea & {
  actions: MenuItem[];
  homeMenu: MenuItem[];
  mainMenu: MenuCategory[];
  footerMenu: MenuCategory[];
};

export type Nav = LayoutArea & {
  title: string;
};

export type DefaultViewLayout = {
  header: HeaderMenu;
  sidebar: Sidebar;
  sidepane: Sidepane;
  nav: Nav;
};

export type ViewLayoutOptions = {
  header: Partial<HeaderMenu>;
  sidebar: Partial<Sidebar>;
  sidepane: Partial<Sidepane>;
  nav: Partial<Nav>;
};

export type ViewLayout = Partial<ViewLayoutOptions>;
