import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class MenuService {
  private observer = new Subject<{ type: "open" | "close"; menu: Menu }>();
  private subscriber = this.observer.asObservable();

  public get subscribe() {
    return this.subscriber.subscribe.bind(this.subscriber);
  }

  public open(menu: Menu) {
    this.observer.next({ type: "open", menu });
  }

  public close(menu: Menu) {
    this.observer.next({ type: "close", menu });
  }
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type Menu = {
  id: string;
  type: string;
  area: string;
  categories: Category[];
  items: Item[];
};

type Category = {
  name: string;
  items: Item[];
};

type Item = {
  name: string;
  href: string;
};
