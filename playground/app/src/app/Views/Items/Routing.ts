import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { BoardComponent } from "./Board/Component";
import { ItemComponent } from "./Item/Component";

const routes: Routes = [
  { path: "", component: BoardComponent },
  { path: ":id", component: ItemComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemRoutingModule {}
