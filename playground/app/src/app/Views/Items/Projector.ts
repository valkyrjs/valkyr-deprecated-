import { On, Projector } from "@valkyr/angular";
import { LedgerEventRecord } from "@valkyr/ledger";
import { ItemStore } from "stores";

import { Item } from "./Models/Item";

export class ItemProjector extends Projector {
  @On("ItemCreated")
  public async handleItemCreated({
    streamId,
    data: { workspaceId, name, details, state }
  }: LedgerEventRecord<ItemStore.Created>) {
    await Item.insertOne({
      id: streamId,
      workspaceId,
      name,
      details,
      state
    });
  }

  @On("ItemSortSet")
  public async handleItemSortSet({ streamId, data: { sort } }: LedgerEventRecord<ItemStore.SortSet>) {
    await Item.updateOne({ id: streamId }, { $set: { sort } });
  }
}
