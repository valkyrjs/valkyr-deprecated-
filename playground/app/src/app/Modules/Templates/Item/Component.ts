import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { DOCUMENT_TITLE, TitleService } from "@valkyr/angular";
import panzoom, { PanZoom } from "panzoom";

@Component({
  selector: "template",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class TemplateItemComponent implements AfterViewInit {
  zoomScale = 1;
  zoomFactor = 0.05;
  panzoomCanvas?: PanZoom;

  @ViewChild("canvas") canvasElement: ElementRef;

  constructor(title: TitleService, el: ElementRef<HTMLElement>) {
    title.set("Template Designer", DOCUMENT_TITLE, "discovery");
    this.canvasElement = el;
  }

  ngAfterViewInit() {
    console.log(this.canvasElement);
    this.panzoomCanvas = panzoom(this.canvasElement.nativeElement, {
      maxZoom: 1,
      minZoom: 0.1
    });
    console.log(this.panzoomCanvas);

    this.panzoomCanvas.on("transform", () => {
      const result = this.panzoomCanvas?.getTransform();
      if (result) {
        this.zoomScale = result.scale;
      }
    });
  }

  pausePanzoom() {
    this.panzoomCanvas?.pause();
  }

  resumePanzoom() {
    this.panzoomCanvas?.resume();
  }

  // onCanvasZoom(event) {
  //   if (event.deltaY < 0) {
  //     console.log('scrolling up', this.zoomLevel);
  //     this.zoomLevel += this.zoomFactor;
  //   } else if (event.deltaY > 0) {
  //     console.log('scrolling down', this.zoomLevel);
  //     this.zoomLevel -= this.zoomFactor;
  //   }
  // }
}
