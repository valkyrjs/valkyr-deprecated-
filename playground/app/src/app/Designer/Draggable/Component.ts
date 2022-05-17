import { CdkDrag } from "@angular/cdk/drag-drop";
import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "draggable",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class DraggableComponent {
  @Input() zoomScale = 1;
  @Input() pos = { x: 0, y: 0 };

  @Output() dragStart = new EventEmitter<any>();
  @Output() dragEnd = new EventEmitter<any>();

  dragConstrainPoint = (point: any, dragRef: any) => {
    let zoomMoveXDifference = 0;
    let zoomMoveYDifference = 0;
    console.log(
      "freeDragPosition dragRef: " +
        Math.round(dragRef.getFreeDragPosition().x) +
        " / " +
        Math.round(dragRef.getFreeDragPosition().y)
    );

    if (this.zoomScale != 1) {
      zoomMoveXDifference = (1 - this.zoomScale) * dragRef.getFreeDragPosition().x;
      zoomMoveYDifference = (1 - this.zoomScale) * dragRef.getFreeDragPosition().y;
    }
    console.log(
      "zoomMoveXDifference x/y: " + Math.round(zoomMoveXDifference) + " / " + Math.round(zoomMoveYDifference)
    );
    console.log("Point x/y: " + Math.round(point.x) + " / " + Math.round(point.y));
    console.log(
      "Sum x/y: " + Math.round(point.x + zoomMoveXDifference) + " / " + Math.round(point.y + zoomMoveYDifference)
    );

    return {
      x: point.x + zoomMoveXDifference,
      y: point.y + zoomMoveYDifference
    };
  };

  startDragging() {
    console.log("START");
    this.dragStart.emit();
  }

  endDragging($event: any) {
    console.log("END");
    const elementMoving = $event.source.getRootElement();
    const elementMovingRect: ClientRect = elementMoving.getBoundingClientRect();
    const elementMovingParentElementRect: ClientRect = elementMoving.parentElement.getBoundingClientRect();
    /* The getBoundingClientRect() method returns the size of an element and its position relative to the viewport.
    This method returns a DOMRect object with eight properties: left, top, right, bottom, x, y, width, height. https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_element_getboundingclientrect*/
    console.log(
      "elementMovingParentElementRect .left/.top: " +
        Math.trunc(elementMovingParentElementRect.left) +
        " / " +
        Math.trunc(elementMovingParentElementRect.top)
    );
    console.log(
      "elementMovingRect .left/.top: " + Math.trunc(elementMovingRect.left) + " / " + Math.trunc(elementMovingRect.top)
    );
    console.log(
      "Difference scaled .left/.top: " +
        Math.trunc((elementMovingRect.left - elementMovingParentElementRect.left) / this.zoomScale) +
        " / " +
        Math.trunc((elementMovingRect.top - elementMovingParentElementRect.top) / this.zoomScale)
    );

    this.pos.x = (elementMovingRect.left - elementMovingParentElementRect.left) / this.zoomScale;
    this.pos.y = (elementMovingRect.top - elementMovingParentElementRect.top) / this.zoomScale;

    const cdkDrag = $event.source as CdkDrag;
    cdkDrag.reset();

    this.dragEnd.emit();
  }
}
