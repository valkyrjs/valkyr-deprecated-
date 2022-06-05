import { Component, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { Item } from "../Models";
import { ItemService } from "../Services/Item";

@Component({
  selector: "list-item",
  templateUrl: "./Template.html"
})
export class ItemComponent {
  @Input("item") item!: Item; // we may not want to pass the Item, but just the ID, depending on how we store/query Items.

  constructor(readonly itemService: ItemService, readonly route: ActivatedRoute) {}
}
