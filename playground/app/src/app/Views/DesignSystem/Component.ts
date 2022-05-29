import { Component } from "@angular/core";
import { ButtonVariant } from "@valkyr/tailwind";

import { LayoutService } from "../../Shared/Layout/Services/LayoutService";

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

  public colors: { name: string; weights: number[] }[] = [
    { name: "gray", weights: [50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900] },
    { name: "celery", weights: [400, 500, 600, 700] },
    { name: "chartreuse", weights: [400, 500, 600, 700] },
    { name: "yellow", weights: [400, 500, 600, 700] },
    { name: "magenta", weights: [400, 500, 600, 700] },
    { name: "fuchsia", weights: [400, 500, 600, 700] },
    { name: "purple", weights: [400, 500, 600, 700] },
    { name: "indigo", weights: [400, 500, 600, 700] },
    { name: "seafoam", weights: [400, 500, 600, 700] },
    { name: "red", weights: [100, 400, 500, 600, 700] },
    { name: "orange", weights: [400, 500, 600, 700] },
    { name: "green", weights: [400, 500, 600, 700] },
    { name: "blue", weights: [100, 400, 500, 600, 700] }
  ];

  public options = [
    {
      label: "Apple",
      value: "1"
    },
    {
      label: "Orange",
      value: "2"
    },
    {
      label: "Pineapple",
      value: "3"
    }
  ];

  public getClass(color: string, weight: number) {
    return `bg-${color}-${weight} ${weight > 300 ? "text-white" : "text-black"}`;
  }

  constructor(layout: LayoutService) {
    layout.updateLayout({
      header: { isVisible: true },
      sidebar: { isVisible: false },
      sidepane: {
        isVisible: true,
        mainMenu: [
          {
            name: "Main",
            showLabel: false,
            items: [
              {
                type: "link",
                icon: "home",
                name: "Home",
                href: "/workspaces"
              },
              {
                type: "link",
                icon: "design",
                name: "Design System",
                href: "/ui"
              }
            ]
          }
        ]
      },
      nav: { isVisible: true, title: "Design System" }
    });
  }
}
