import { Component, Input } from "@angular/core";

@Component({
  selector: "icon",
  template: `<svg-icon src="/assets/icons/{{ name }}.svg" attr.class="{{ class }}"></svg-icon>`
})
export class IconComponent {
  @Input() name!: string;
  @Input() class?: string;
}
