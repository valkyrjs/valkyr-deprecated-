import { faker } from "@faker-js/faker";
import { Document, Model, PartialDocument } from "@valkyr/db";

type UserDocument = Document & {
  name: string;
  email: string;
  posts: number;
  createdAt: number;
};

export class User extends Model<UserDocument> {
  readonly name!: UserDocument["name"];
  readonly email!: UserDocument["email"];
  readonly posts!: UserDocument["posts"];
  readonly createdAt!: UserDocument["createdAt"];

  static fake(): PartialDocument<UserDocument> {
    return {
      name: faker.name.fullName(),
      email: faker.internet.email(),
      posts: 0,
      createdAt: Date.now()
    };
  }
}
