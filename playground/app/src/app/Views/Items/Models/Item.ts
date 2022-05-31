import { Document, Model } from "@valkyr/db";

export type ItemDocument = Document & {
  workspaceId: string;
  name: string;
  sort?: number;
};

export class Item extends Model<ItemDocument> {
  readonly workspaceId!: ItemDocument["workspaceId"];
  readonly name!: ItemDocument["name"];
  readonly sort?: ItemDocument["sort"];
}

export type ItemModel = typeof Item;
