import { Collection } from "../src/collection";
import { MemoryStorage } from "../src/databases/memory.storage";
import { Model } from "../src/model";
import { UserDocument } from "./User";

export class User extends Model<UserDocument> {
  readonly name!: UserDocument["name"];
  readonly email!: UserDocument["email"];
  readonly friends!: UserDocument["friends"];
  readonly interests!: UserDocument["interests"];
}

User.$collection = new Collection("users", new MemoryStorage("users"));
