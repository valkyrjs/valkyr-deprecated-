import { ButtonVariant } from "@valkyr/tailwind";

export type MenuItem = {
  type: MenuItemType;
  name: string;
  icon?: string;
  href?: string;
  action?: any;
  match?: RegExp;
  variant?: ButtonVariant;
};

export type MenuItemType = "link" | "action";