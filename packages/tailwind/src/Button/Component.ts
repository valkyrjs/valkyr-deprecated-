import { Component, ElementRef, Input } from "@angular/core";

@Component({
  selector: "button[variant]",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = "primary";

  constructor(private elRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.elRef.nativeElement.setAttribute("variant", this.variant);
  }
}

export type ButtonVariant = "cta" | "primary" | "secondary" | "negative";
