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
    if (this.zoomScale != 1) {
      zoomMoveXDifference = (1 - this.zoomScale) * dragRef.getFreeDragPosition().x;
      zoomMoveYDifference = (1 - this.zoomScale) * dragRef.getFreeDragPosition().y;
    }

    return {
      x: point.x + zoomMoveXDifference,
      y: point.y + zoomMoveYDifference
    };
  };

  startDragging() {
    this.dragStart.emit();
  }

  endDragging($event: any) {
    const elementMoving = $event.source.getRootElement();
    const elementMovingRect = elementMoving.getBoundingClientRect();
    const elementMovingParentElementRect = elementMoving.parentElement.getBoundingClientRect();
    this.pos.x = (elementMovingRect.left - elementMovingParentElementRect.left) / this.zoomScale;
    this.pos.y = (elementMovingRect.top - elementMovingParentElementRect.top) / this.zoomScale;

    const cdkDrag = $event.source as CdkDrag;
    cdkDrag.reset();

    this.dragEnd.emit();
  }
}
