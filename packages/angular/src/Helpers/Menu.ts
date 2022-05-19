const MENU_TYPE_DEFAULT = "menu:default";

export class Menu {
  readonly #settings: MenuSettings;

  constructor(settings: MenuSettings) {
    this.#settings = settings;
  }

  get type(): string {
    return this.#settings.type ?? MENU_TYPE_DEFAULT;
  }

  get params(): Params {
    return this.#settings.params ?? {};
  }

  get categories(): MenuCategory[] {
    return this.#settings.categories?.map((category) => new MenuCategory(category, this.params)) ?? [];
  }
}

class MenuCategory {
  readonly #category: Category;
  readonly #params: Params;

  constructor(category: Category, params: Params) {
    this.#category = category;
    this.#params = params;
  }

  get showLabel(): boolean {
    return this.#category.showLabel === undefined ? true : this.#category.showLabel;
  }

  get name(): string {
    return this.#category.name ?? "";
  }

  get items(): MenuListItem[] {
    return this.#category.items.map((item) => new MenuListItem(item, this.#params));
  }
}

export class MenuListItem {
  readonly #item: MenuItem;
  readonly #params: Params;

  constructor(item: MenuItem, params: Params) {
    this.#item = item;
    this.#params = params;
  }

  get type(): MenuItemType {
    return this.#item.type;
  }

  get name(): string {
    return this.#item.name;
  }

  get isActive(): boolean {
    return this.#item.isActive === undefined ? false : this.#item.isActive;
  }

  get action(): any {
    if (this.#item.action && this.#item.type === "action") {
      return this.#item.action;
    }
  }

  get href(): string {
    if (!(this.#item.href && this.#item.type === "link")) {
      return "/";
    }
    let link = this.#item.href;
    for (const key in this.#params) {
      link = link.replace(`{{${key}}}`, this.#params[key]);
    }
    return link;
  }

  get icon(): string | undefined {
    return this.#item.icon;
  }
}

export type MenuSettings = {
  categories: Category[];
  params?: Params;
  type?: string;
};

type Category = {
  name?: string;
  showLabel?: boolean;
  icon?: string;
  items: MenuItem[];
};

export type MenuItem = {
  name: string;
  type: MenuItemType;
  isActive?: boolean;
  href?: string;
  action?: any;
  icon?: string;
};

type Params = Record<string, string>;

export type MenuItemType = "link" | "action";
