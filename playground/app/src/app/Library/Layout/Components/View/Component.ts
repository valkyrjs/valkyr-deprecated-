import { Component, ElementRef, Input, OnInit } from "@angular/core";

import { ViewLayout } from "../../Models/ViewLayout";
import { LayoutService } from "../../Services/LayoutService";

@Component({
  selector: "app-view",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class ViewComponent implements OnInit {
  @Input("layout") layout!: ViewLayout;
  isRaw = true;

  constructor(readonly layoutService: LayoutService, private elRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.layoutService.settings.subscribe((settings) => {
      this.layout = settings;
      this.elRef.nativeElement.setAttribute("layout", this.#getLayout(settings));
      this.isRaw =
        settings.header.isVisible === false &&
        settings.sidebar.isVisible === false &&
        settings.sidepane.isVisible === false &&
        settings.nav.isVisible === false;
    });
  }

  #getLayout(settings: ViewLayout): string {
    const layout = [
      settings.header.isVisible ? "header" : "",
      settings.nav.isVisible ? "nav" : "",
      settings.sidebar.isVisible ? "sidebar" : "",
      settings.sidepane.isVisible ? "sidepane" : ""
    ];
    return layout.filter((i) => i.length).join("__");
  }
}
