import { Adapter } from "./Adapters";
import { Collection } from "./Collection";
import { ModelClass } from "./Model";

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
 * @param adapter    - Adapter to create collections under.
 */
function register<Model extends ModelClass>(registrars: ModelRegistrars<Model>[], adapter: Adapter): void {
  for (const { name, model } of registrars) {
    model.$collection = new Collection(name, adapter);
  }
}

type ModelRegistrars<Model extends ModelClass> = {
  name: string;
  model: Model;
};

export const database = {
  register
};
