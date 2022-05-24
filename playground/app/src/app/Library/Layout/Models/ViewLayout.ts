import { MenuCategory } from "./MenuCategory";
import { MenuItem } from "./MenuItem";

type LayoutArea = {
  isVisible: boolean;
  isBordered: boolean;
};

type Header = LayoutArea & {
  menu: MenuItem[];
};

type Sidebar = LayoutArea & {
  menu: MenuItem[];
};

type Sidepane = LayoutArea & {
  actions: MenuItem[];
  homeMenu: MenuItem[];
  mainMenu: MenuCategory[];
  footerMenu: MenuCategory[];
};

type Nav = LayoutArea & {
  title: string;
};

export type DefaultViewLayout = {
  header: Header;
  sidebar: Sidebar;
  sidepane: Sidepane;
  nav: Nav;
};

export type ViewLayoutOptions = {
  header: Partial<Header>;
  sidebar: Partial<Sidebar>;
  sidepane: Partial<Sidepane>;
  nav: Partial<Nav>;
};

export type ViewLayout = Partial<ViewLayoutOptions>;
