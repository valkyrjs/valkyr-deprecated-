import { faker } from "@faker-js/faker";

/**
 * Get fake user data that can be inserted on the users collection.
 */
export function getFakeUserData() {
  return {
    name: faker.name.fullName(),
    email: faker.internet.email(),
    posts: 0,
    createdAt: Date.now()
  };
}
