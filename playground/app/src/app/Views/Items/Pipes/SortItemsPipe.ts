import { Pipe } from "@angular/core";

import { Item } from "../Models";

@Pipe({ name: "sortitems" })
export class SortItemsPipe {
  transform(value: Item[]) {
    return value.sort((a: Item, b: Item) => {
      if (a.sort == b.sort) return 0;
      else if (!a.sort) return -1;
      else if (b.sort && a.sort < b.sort) return -1;

      return 1;
    });
  }
}
