import { DragDropModule } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { Database } from "@valkyr/angular";
import { Collection, IndexedDbAdapter } from "@valkyr/db";
import { ButtonModule, IconModule, ModalModule } from "@valkyr/tailwind";
import { NgScrollbarModule } from "ngx-scrollbar";

import { BoardComponent } from "./Board/Component";
import { CreateItem } from "./CreateItem/Component";
import { ListComponent } from "./List/Component";
import { ItemComponent } from "./ListItem/Component";
import { Item } from "./Models/Item";
import { SortItemsPipe } from "./Pipes/SortItemsPipe";
import { ItemRoutingModule } from "./Routing";
import { ItemService } from "./Services/Item";
import { ItemSubscriberService } from "./Services/ItemSubscriber";

@NgModule({
  declarations: [BoardComponent, ItemComponent, ListComponent, CreateItem, SortItemsPipe],
  imports: [
    CommonModule,
    IconModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    ModalModule,
    DragDropModule,
    NgScrollbarModule
  ],
  exports: [ItemComponent, BoardComponent, ListComponent, ItemRoutingModule],
  providers: [
    Database.for([
      {
        model: Item,
        collection: new Collection("items", new IndexedDbAdapter())
      }
    ]),
    ItemService,
    ItemSubscriberService
  ]
})
export class ItemsModule {}
