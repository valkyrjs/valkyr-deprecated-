import { Collection } from "./Collection";
import { ModelClass } from "./Model";
import { IndexedDbStorage, MemoryStorage } from "./Storage";

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
 * register(
 *   [
 *    { name: "accounts", model: Account },
 *    { name: "users", model: User }
 *   ],
 *   new IndexedDbAdapter()
 * );
 * ```
 *
 * @param registrars - List of models to register.
 * @param storage    - Storage adapter to persist collection data to.
 */
function register(registrars: ModelRegistrars[], storage: typeof IndexedDbStorage | typeof MemoryStorage): void {
  for (const { name, model } of registrars) {
    model.$collection = new Collection(name, storage);
  }
}

type ModelRegistrars = {
  name: string;
  model: ModelClass;
};

export const database = {
  register
};
