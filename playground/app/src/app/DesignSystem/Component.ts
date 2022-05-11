import { Component } from "@angular/core";
import { DOCUMENT_TITLE, TitleService } from "@valkyr/angular";
import type { ButtonVariant } from "@valkyr/tailwind";

@Component({
  selector: "design-system",
  templateUrl: "./Template.html"
})
export class DesignSystemComponent {
  public btns: { variant: ButtonVariant; label: string }[] = [
    { variant: "cta", label: "CTA" },
    { variant: "primary", label: "Primary" },
    { variant: "secondary", label: "Secondary" },
    { variant: "negative", label: "Negative" }
  ];

  constructor(title: TitleService) {
    title.set("Design System", DOCUMENT_TITLE, "discovery");
  }
}
