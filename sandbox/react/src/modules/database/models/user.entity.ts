import { faker } from "@faker-js/faker";
import { Document, Model } from "@valkyr/db";

type UserDocument = Document & {
  name: string;
  email: string;
};

export class User extends Model<UserDocument> {
  readonly name!: UserDocument["name"];
  readonly email!: UserDocument["email"];

  static async faker(count = 1): Promise<void> {
    if (count > 1) {
      await this.insertMany(
        Array(count)
          .fill(0)
          .map(() => ({ name: faker.name.fullName(), email: faker.internet.email() }))
      );
    } else {
      await this.insertOne({
        name: faker.name.fullName(),
        email: faker.internet.email()
      });
    }
  }
}
