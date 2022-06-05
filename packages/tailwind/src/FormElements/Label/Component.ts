import { Component, ElementRef } from "@angular/core";

@Component({
  selector: "label",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class LabelComponent {
  constructor(private elRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    // this.elRef.nativeElement.setAttribute("size", this.size);
  }
}
