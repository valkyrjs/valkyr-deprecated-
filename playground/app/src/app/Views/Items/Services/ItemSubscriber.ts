import { Inject, Injectable } from "@angular/core";
import { DataSubscriberService, StreamService } from "@valkyr/angular";

import { Item, ItemModel } from "../Models/Item";

@Injectable({ providedIn: "root" })
export class ItemSubscriberService extends DataSubscriberService<ItemModel> {
  constructor(@Inject(Item) readonly model: ItemModel, readonly stream: StreamService) {
    super();
  }
}
