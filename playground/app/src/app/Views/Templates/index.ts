import { DragDropModule } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { Database, ModalModule } from "@valkyr/angular";
import { Collection, IndexedDbAdapter } from "@valkyr/db";
import { ButtonModule } from "@valkyr/tailwind";

import { CreateTemplateDialog } from "./Dialogues/CreateTemplate/Component";
import { DraggableComponent } from "./Draggable/Component";
import { TemplateItemComponent } from "./Item/Component";
import { TemplateListComponent } from "./List/Component";
import { Template } from "./Models/Template";
import { TemplateProjector } from "./Projector";
import { TemplateService } from "./Services/Template";
import { TemplateValidator } from "./Validator";

@NgModule({
  imports: [CommonModule, DragDropModule, FormsModule, RouterModule, ModalModule, ButtonModule],
  declarations: [TemplateListComponent, TemplateItemComponent, CreateTemplateDialog, DraggableComponent],
  providers: [
    Database.for([
      {
        model: Template,
        collection: new Collection("templates", new IndexedDbAdapter())
      }
    ]),
    TemplateService,
    TemplateValidator.register(),
    TemplateProjector.register()
  ],
  exports: [TemplateListComponent, TemplateItemComponent]
})
export class TemplateModule {}

export * from "./Models/Template";