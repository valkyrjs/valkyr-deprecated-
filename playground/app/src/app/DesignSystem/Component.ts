import { Component } from "@angular/core";
import { DOCUMENT_TITLE, TitleService } from "@valkyr/angular";

@Component({
  selector: "design-system",
  templateUrl: "./Template.html"
})
export class DesignSystemComponent {
  public btns: any[] = [
    { variant: "cta", label: "CTA" },
    { variant: "cta-outline", label: "CTA Outline" },
    { variant: "primary", label: "Primary" }
  ];

  constructor(title: TitleService) {
    title.set("Design System", DOCUMENT_TITLE, "discovery");
  }
}
