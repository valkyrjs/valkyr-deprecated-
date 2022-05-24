import { Injectable } from "@angular/core";
import { GuardsCheckEnd, Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";

import { ViewLayout } from "../Models/ViewLayout";

@Injectable({ providedIn: "root" })
export class LayoutService {
  instance: number = new Date().getTime();

  private viewLayout = new BehaviorSubject<ViewLayout>({
    header: { isVisible: true },
    sidebar: { isVisible: false },
    sidepane: { isVisible: false },
    nav: { isVisible: false }
  });

  public readonly settings: Observable<ViewLayout> = this.viewLayout.asObservable();

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      console.log(event);
      if (event instanceof GuardsCheckEnd && event.shouldActivate === true && event.url.includes("authorize")) {
        this.updateLayout({
          header: { isVisible: false },
          sidebar: { isVisible: false },
          sidepane: { isVisible: false },
          nav: { isVisible: false }
        });
      }
    });
  }

  updateLayout(layout: ViewLayout): void {
    this.viewLayout.next({ ...this.viewLayout, ...layout });
    globalThis.document.title = ["Valkyr", layout.nav?.title ?? ""].join(" - ");
  }
}
