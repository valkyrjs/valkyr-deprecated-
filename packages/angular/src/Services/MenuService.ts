import { Injectable } from "@angular/core";
import { ActivationEnd, Router } from "@angular/router";
import { Subject } from "rxjs";

export const MENU_TYPE_DEFAULT = "__default__";

@Injectable({
  providedIn: "root"
})
export class MenuService {
  private observer = new Subject<{ type: "open" | "close"; menu: Menu }>();
  private subscriber = this.observer.asObservable();

  constructor(private router: Router) {}

  public get subscribe() {
    return this.subscriber.subscribe.bind(this.subscriber);
  }

  public init() {
    return this.router.events.subscribe((observer) => {
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

  public open(menu: Menu) {
    this.observer.next({ type: "open", menu });
  }

  public close(menu: Menu) {
    this.observer.next({ type: "close", menu });
  }
}

export class Menu {
  constructor(private settings: MenuSettings, private params: Params = {}) {}

  public get id(): string {
    return this.settings.id;
  }

  public get type(): string {
    return this.settings.type ?? MENU_TYPE_DEFAULT;
  }

  public get area(): string {
    return this.settings.area;
  }

  public get categories(): MenuCategory[] {
    return this.settings.categories?.map((category) => new MenuCategory(category, this.params)) ?? [];
  }
}

class MenuCategory {
  constructor(private category: Category, private params: Params) {}

  public get name(): string {
    return this.category.name ?? "";
  }

  public get items(): MenuItem[] {
    return this.category.items.map((item) => new MenuItem(item, this.params));
  }
}

class MenuItem {
  constructor(private item: Item, private params: Params) {}

  public get name(): string {
    return this.item.name;
  }

  public get href(): string {
    let link = this.item.href;
    for (const key in this.params) {
      link = link.replace(`{{${key}}}`, this.params[key]);
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
