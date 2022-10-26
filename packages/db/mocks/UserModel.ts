import { database } from "../src/Database";
import { Model } from "../src/Model";
import { MemoryStorage } from "../src/Storage";
import { UserDocument } from "./User";

export class User extends Model<UserDocument> {
  readonly name!: UserDocument["name"];
  readonly email!: UserDocument["email"];
  readonly friends!: UserDocument["friends"];
  readonly interests!: UserDocument["interests"];
}

database.register([{ name: "User", model: User }], MemoryStorage);
