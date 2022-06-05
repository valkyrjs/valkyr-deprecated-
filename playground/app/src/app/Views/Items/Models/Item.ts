import { Document, Model } from "@valkyr/db";
import { ItemState } from "stores/src/Item";

export type ItemDocument = Document & {
  workspaceId: string;
  name: string;
  details: string;
  sort?: number;
  state: ItemState;
  assignedTo?: string;
  updatedAt?: string;
  completedAt?: string;
};

export class Item extends Model<ItemDocument> {
  readonly workspaceId!: ItemDocument["workspaceId"];
  readonly name!: ItemDocument["name"];
  readonly details: ItemDocument["sort"];
  readonly sort?: ItemDocument["sort"];
  readonly state: ItemDocument["sort"];
  readonly assignedTo?: ItemDocument["assignedTo"];
  readonly updatedAt?: ItemDocument["updatedAt"];
  readonly completedAt?: ItemDocument["completedAt"];
}

export type ItemModel = typeof Item;
