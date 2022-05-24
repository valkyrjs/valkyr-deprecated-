import { Component, ElementRef, Input, OnInit } from "@angular/core";

import { DefaultViewLayout, ViewLayout } from "../../Models/ViewLayout";
import { LayoutService } from "../../Services/LayoutService";

@Component({
  selector: "app-view",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class ViewComponent implements OnInit {
  @Input("layout") layout!: DefaultViewLayout;
  isRaw = true;

  constructor(readonly layoutService: LayoutService, private elRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.layoutService.settings.subscribe((settings) => {
      this.layout = settings;
      this.elRef.nativeElement.setAttribute("layout", this.#getLayout(settings));
      this.elRef.nativeElement.setAttribute("borders", this.#getBorders(settings));
      this.isRaw =
        settings.header.isVisible === false &&
        settings.sidebar.isVisible === false &&
        settings.sidepane.isVisible === false &&
        settings.nav.isVisible === false;
    });
  }

  #getLayout(settings: DefaultViewLayout): string {
    const { header, nav, sidebar, sidepane } = settings;
    const layout = [
      header.isVisible ? "header" : "",
      nav.isVisible ? "nav" : "",
      sidebar.isVisible ? "sidebar" : "",
      sidepane.isVisible ? "sidepane" : ""
    ];
    return layout.filter((i) => i.length).join("__");
  }

  #getBorders(settings: DefaultViewLayout): string {
    const { header, nav, sidebar, sidepane } = settings;
    const borders = [
      header.isVisible ? "header" : "",
      nav.isVisible && nav.isBordered ? "nav" : "",
      sidebar.isVisible ? "sidebar" : "",
      sidepane.isVisible && sidepane.isBordered ? "sidepane" : ""
    ];
    return borders.filter((i) => i.length).join("__");
  }
}
