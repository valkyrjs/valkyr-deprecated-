import { MenuCategory } from "./MenuCategory";
import { MenuItem } from "./MenuItem";

export type ViewLayout = {
  isRaw?: boolean;
  header: {
    isVisible: boolean;
    menu?: MenuItem[];
  };
  sidebar: {
    isVisible: boolean;
    menu?: MenuItem[];
  };
  sidepane: {
    isVisible: boolean;
    actions?: MenuItem[];
    homeMenu?: MenuItem[];
    mainMenu?: MenuCategory[];
    footerMenu?: MenuCategory[];
  };
  nav: {
    isVisible: boolean;
    title?: string;
  };
};
