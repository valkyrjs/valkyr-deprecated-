import { InstanceAdapter } from "../src/Adapters";
import { Collection } from "../src/Collection";
import { UserDocument } from "./User";

export function getUserCollection(): Collection<UserDocument> {
  return new Collection<UserDocument>("users", new InstanceAdapter());
}
