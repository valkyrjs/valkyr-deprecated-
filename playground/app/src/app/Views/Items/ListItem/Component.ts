import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { Item } from "../Models";
import { ItemService } from "../Services/Item";

@Component({
  selector: "list-item",
  templateUrl: "./Template.html"
})
export class ItemComponent implements OnInit, OnDestroy {
  @Input("item") item!: Item;

  constructor(readonly itemService: ItemService, readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    const itemId = this.route.snapshot.paramMap.get("item");
    if (!itemId) {
      throw new Error("ItemComponent Violation: Could not resolve item id");
    }
    if (itemId !== this.item.id) {
      throw new Error("ItemComponent Violation: Invalid Item");
    }
  }

  ngOnDestroy(): void {
    this.itemService.unsubscribe();
  }
}
