import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AuthService, DOCUMENT_TITLE, LedgerService, ParamsService, TitleService } from "@valkyr/angular";
import { ModalService } from "@valkyr/angular/src/Components/Modal/Service";
import panzoom, { PanZoom } from "panzoom";

import { WorkspaceService } from "../../Workspace";
import { CreateTemplateDialog } from "../Dialogues/CreateTemplate/Component";
import { Template } from "../Models/Template";
import { TemplateService } from "../Services/Template";

@Component({
  selector: "templates",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class TemplateListComponent implements AfterViewInit {
  zoomScale = 1;
  zoomFactor = 0.05;
  panzoomCanvas?: PanZoom;

  templates: Template[] = [];
  name = "";

  @ViewChild("canvas") canvasElement: ElementRef;

  constructor(
    el: ElementRef<HTMLElement>,
    readonly workspace: WorkspaceService,
    readonly template: TemplateService,
    readonly ledger: LedgerService,
    readonly modal: ModalService,
    readonly title: TitleService,
    readonly params: ParamsService,
    readonly route: ActivatedRoute,
    readonly auth: AuthService
  ) {
    this.canvasElement = el;
  }

  ngOnInit(): void {
    const workspaceId = this.workspace.selected;
    if (!workspaceId) {
      throw new Error("TodoPickerComponent Violation: Could not resolve current workspace");
    }
    this.#loadWorkspace(workspaceId);
    this.#loadTemplates(workspaceId);
  }

  ngOnDestroy(): void {
    this.workspace.unsubscribe(this);
    this.template.unsubscribe(this);
  }

  #loadWorkspace(workspaceId: string) {
    this.workspace.subscribe(this, { criteria: { id: workspaceId }, limit: 1 }, (workspace) => {
      if (workspace) {
        this.title.set(`${workspace.name} Templates`, DOCUMENT_TITLE, "workspace");
      }
    });
  }

  #loadTemplates(workspaceId: string) {
    this.template.subscribe(
      this,
      {
        criteria: { workspaceId },
        stream: {
          aggregate: "template",
          endpoint: `/workspaces/${workspaceId}/templates`
        }
      },
      (templates) => {
        this.templates = templates;
      }
    );
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

  public openAddTemplate() {
    this.modal.open(CreateTemplateDialog);
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
