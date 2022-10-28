import { faker } from "@faker-js/faker";
import { Document, Model } from "@valkyr/db";

import { User } from "./user.entity";

type PostDocument = Document & {
  body: string;
  likes: number;
  comments: number;
  createdBy: string;
  createdAt: number;
};

export class Post extends Model<PostDocument> {
  readonly body!: PostDocument["body"];
  readonly likes!: PostDocument["likes"];
  readonly comments!: PostDocument["comments"];
  readonly createdBy!: PostDocument["createdBy"];
  readonly createdAt!: PostDocument["createdAt"];

  static async faker(user: User): Promise<void> {
    await this.insertOne({
      body: faker.lorem.paragraph(),
      likes: 0,
      comments: 0,
      createdBy: user.id,
      createdAt: Date.now()
    });
  }
}
