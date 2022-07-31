import { Collection } from "./Collection";
import { ModelClass } from "./Model";
import { Adapter } from "./Storage";

/**
 * Assigns collections using the provided adapter to each model in
 * the models list. This works as a pseudo dependency injection
 * layer to allow for a single entry point to easily change this
 * base on the environment being run.
 *
 * For example:
 * ```ts
 * import { register } from "@valkyr/db";
 *
 * import { Account } from "./Account";
 * import { User } from "./User";
 *
 * register([Account, User], new IndexedDbAdapter());
 * ```
 *
 * @param models  - List of models.
 * @param adapter - Adapter to create collections under.
 */
export function register(models: ModelClass[], adapter: Adapter): void {
  for (const model of models) {
    model.$collection = new Collection(model.name, adapter);
  }
}
