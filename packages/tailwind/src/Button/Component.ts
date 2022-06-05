import { Component, ElementRef, Input } from "@angular/core";

@Component({
  selector: "button[variant]",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = "primary";
  @Input() size: ButtonSize = "base";

  constructor(private elRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.elRef.nativeElement.setAttribute("variant", this.variant);
    if (this.size !== "base") {
      this.elRef.nativeElement.setAttribute("size", this.size);
    }
  }
}

export type ButtonVariant = "cta" | "primary" | "secondary" | "negative";

export type ButtonSize = "base" | "medium" | "large";
