import { Component, ElementRef, Input } from "@angular/core";

@Component({
  selector: "checkbox",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class CheckboxComponent {
  @Input() size: CheckboxSize = "s";

  constructor(private elRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.elRef.nativeElement.setAttribute("size", this.size);
  }
}

export type CheckboxSize = "s" | "m" | "l";
