import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DOCUMENT_TITLE, TitleService } from "@valkyr/angular";

import { Item } from "../Models";
import { ItemService } from "../Services/Item";

@Component({
  selector: "item",
  templateUrl: "./Template.html"
})
export class ItemComponent implements OnInit, OnDestroy {
  item!: Item;

  constructor(readonly itemService: ItemService, readonly route: ActivatedRoute, readonly title: TitleService) {}

  ngOnInit(): void {
    const itemId = this.route.snapshot.paramMap.get("item");
    if (!itemId) {
      throw new Error("ItemItemComponent Violation: Could not resolve item id");
    }
    this.#loadItem(itemId);
  }

  ngOnDestroy(): void {
    this.itemService.unsubscribe();
  }

  #loadItem(itemId: string) {
    this.itemService.subscribe(
      {
        criteria: { id: itemId },
        limit: 1,
        stream: {
          aggregate: "item",
          streamIds: [itemId]
        }
      },
      (item) => {
        if (item) {
          this.item = item;
          this.title.set(`${item.name} Item`, DOCUMENT_TITLE, "workspace");
        }
      }
    );
  }
}
