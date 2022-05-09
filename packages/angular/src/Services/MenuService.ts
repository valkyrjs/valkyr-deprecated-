import { Injectable } from "@angular/core";
import { ActivationEnd, Router } from "@angular/router";

import { SubscriberService } from "../Helpers/SubscriberService";

export const MENU_TYPE_DEFAULT = "__default__";

@Injectable({
  providedIn: "root"
})
export class MenuService extends SubscriberService<{ type: "open" | "close"; menu: Menu }> {
  readonly #router: Router;

  constructor(router: Router) {
    super();
    this.#router = router;
  }

  init() {
    return this.#router.events.subscribe((observer) => {
      if (observer instanceof ActivationEnd) {
        const {
          params,
          data: { menu }
        } = observer.snapshot;
        if (menu !== undefined) {
          if (Array.isArray(menu)) {
            for (const m of menu) {
              this.open(new Menu(m, params));
            }
          } else {
            this.open(new Menu(menu, params));
          }
        }
      }
    });
  }

  open(menu: Menu) {
    this.observer.next({ type: "open", menu });
  }

  close(menu: Menu) {
    this.observer.next({ type: "close", menu });
  }
}

export class Menu {
  readonly #settings: MenuSettings;
  readonly #params: Params;

  constructor(settings: MenuSettings, params: Params = {}) {
    this.#settings = settings;
    this.#params = params;
  }

  get id(): string {
    return this.#settings.id;
  }

  get type(): string {
    return this.#settings.type ?? MENU_TYPE_DEFAULT;
  }

  get area(): string {
    return this.#settings.area;
  }

  get categories(): MenuCategory[] {
    return this.#settings.categories?.map((category) => new MenuCategory(category, this.#params)) ?? [];
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
  id: string;
  area: string;
  type?: string;
  categories?: Category[];
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
