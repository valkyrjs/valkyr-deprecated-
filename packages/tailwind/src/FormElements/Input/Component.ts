import { Component, ElementRef, Input } from "@angular/core";

@Component({
  selector: "input",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class InputComponent {
  @Input("hasError") hasError = false;

  constructor(private elRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.elRef.nativeElement.setAttribute("is-error", String(this.hasError));
  }
}
