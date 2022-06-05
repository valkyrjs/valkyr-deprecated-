import { Injectable } from "@angular/core";
import { GuardsCheckEnd, Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";

import { DefaultViewLayout, ViewLayout } from "../Models/ViewLayout";

const defaults: DefaultViewLayout = {
  header: { isVisible: true, isBordered: true, menu: [] },
  sidebar: { isVisible: false, isBordered: true, menu: [] },
  sidepane: { isVisible: true, isBordered: true, actions: [], homeMenu: [], mainMenu: [], footerMenu: [] },
  nav: { isVisible: true, isBordered: true, title: "" }
};

@Injectable({ providedIn: "root" })
export class LayoutService {
  private viewLayout = new BehaviorSubject<DefaultViewLayout>({ ...defaults });

  public readonly settings: Observable<DefaultViewLayout> = this.viewLayout.asObservable();

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof GuardsCheckEnd && event.shouldActivate === true && event.url.includes("identity")) {
        this.updateLayout({
          header: { isVisible: false },
          sidebar: { isVisible: false },
          sidepane: { isVisible: false, isBordered: true },
          nav: { isVisible: false, isBordered: true }
        });
      }
    });
  }

  updateLayout(layout: ViewLayout): void {
    const next: DefaultViewLayout = {
      header: { ...defaults.header, ...layout.header },
      sidebar: { ...defaults.sidebar, ...layout.sidebar },
      sidepane: { ...defaults.sidepane, ...layout.sidepane },
      nav: { ...defaults.nav, ...layout.nav }
    };
    this.viewLayout.next(next);
    globalThis.document.title = ["Valkyr", next.nav.title].join(" - ");
  }
}
