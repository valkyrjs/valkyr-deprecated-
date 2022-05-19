import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DOCUMENT_TITLE, LedgerService, ParamsService, TitleService } from "@valkyr/angular";
import { ModalService } from "@valkyr/angular/src/Components/Modal/Service";
import { Menu, MenuItem } from "@valkyr/tailwind";
import panzoom, { PanZoom } from "panzoom";

import { WorkspaceService } from "../../Workspace";
import { CreateTemplateDialog } from "../Dialogues/CreateTemplate/Component";
import { getFooterMenu } from "../Menu";
import { Template } from "../Models/Template";
import { TemplateService } from "../Services/Template";

@Component({
  selector: "templates",
  templateUrl: "./Template.html",
  styleUrls: ["./Style.scss"]
})
export class TemplateListComponent implements AfterViewInit {
  zoomScale = 0.1;
  zoomFactor = 0.025;
  panzoomCanvas?: PanZoom;
  aside!: Menu;
  footer!: Menu;
  templates: Template[] = [];
  name = "";
  selectedTemplate?: string = undefined;

  @ViewChild("canvas") canvasElement: ElementRef;

  constructor(
    el: ElementRef<HTMLElement>,
    readonly workspace: WorkspaceService,
    readonly template: TemplateService,
    readonly ledger: LedgerService,
    readonly modal: ModalService,
    readonly title: TitleService,
    readonly params: ParamsService,
    readonly route: ActivatedRoute
  ) {
    this.canvasElement = el;
  }

  ngOnInit(): void {
    const workspaceId = this.route.snapshot.paramMap.get("workspace");
    // const workspaceId = this.workspace.selected;
    if (!workspaceId) {
      throw new Error("Component Violation: Could not resolve current workspace");
    }
    this.workspace.selected = workspaceId;
    this.#loadWorkspace(workspaceId);
    this.#loadTemplates(workspaceId);
  }

  #selectTemplate(templateId: string): void {
    this.selectedTemplate = templateId;
    //this.aside.categories.find(f => f.name === "Templates")?.items.filter(f => f.name === )
  }

  #loadMenu() {
    if (this.workspace.selected) {
      this.footer = getFooterMenu(this.workspace.selected);
      const items: MenuItem[] = this.templates.map((t) => ({
        type: "action",
        isActive: t.id === this.selectedTemplate,
        name: t.name,
        icon: "template",
        action: () => this.#selectTemplate(t.id)
      }));

      this.aside = new Menu({
        categories: [
          {
            name: "Templates",
            items
          },
          {
            name: "Actions",
            items: [
              {
                type: "action",
                isActive: false,
                name: "Add new template...",
                icon: "template-add",
                action: () => this.openAddTemplate()
              }
            ]
          }
        ],
        params: {
          workspaceId: this.workspace.selected
        }
      });
    }
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
        if (this.templates) {
          this.#loadMenu();
        }
      }
    );
  }

  ngAfterViewInit() {
    this.panzoomCanvas = panzoom(this.canvasElement.nativeElement, {
      initialZoom: this.zoomScale,
      maxZoom: 1,
      minZoom: 0.1
    });

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
