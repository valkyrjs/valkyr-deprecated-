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

  get name(): string {
    return this.#category.name ?? "";
  }

  get items(): MenuItem[] {
    return this.#category.items.map((item) => new MenuItem(item, this.#params));
  }
}

class MenuItem {
  readonly #item: Item;
  readonly #params: Params;

  constructor(item: Item, params: Params) {
    this.#item = item;
    this.#params = params;
  }

  get name(): string {
    return this.#item.name;
  }

  get href(): string {
    let link = this.#item.href;
    for (const key in this.#params) {
      link = link.replace(`{{${key}}}`, this.#params[key]);
    }
    return link;
  }
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type MenuSettings = {
  categories: Category[];
  params?: Params;
  type?: string;
};

type Category = {
  name?: string;
  items: Item[];
};

type Item = {
  name: string;
  href: string;
};

type Params = Record<string, string>;
