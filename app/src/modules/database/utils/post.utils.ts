import { faker } from "@faker-js/faker";
import { PartialDocument } from "@valkyr/db";

import { Post } from "../models/post.entity";
import { User } from "../models/user.entity";

/**
 * Get fake post data that can be inserted on the posts collection.
 *
 * @param user - Fake post author.
 */
export function getFakePostData(user: User): PartialDocument<Post> {
  return {
    body: faker.lorem.paragraph(),
    likes: 0,
    comments: 0,
    createdBy: user.id,
    updatedBy: user.id,
    createdAt: Date.now()
  };
}
