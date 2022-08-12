import { Model } from "../src/Model";
import { UserDocument } from "./User";
import { getUserCollection } from "./UserCollection";

export class User extends Model<UserDocument> {
  static readonly $collection = getUserCollection();

  readonly name!: UserDocument["name"];
  readonly email!: UserDocument["email"];
  readonly friends!: UserDocument["friends"];
  readonly interests!: UserDocument["interests"];
}
