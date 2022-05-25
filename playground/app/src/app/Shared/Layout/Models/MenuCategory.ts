import { MenuItem } from "./MenuItem";

export type MenuCategory = {
  name?: string;
  showLabel?: boolean;
  icon?: string;
  items: MenuItem[];
};
