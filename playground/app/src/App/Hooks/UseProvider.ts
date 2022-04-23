import { Type } from "@valkyr/client";

import { app } from "../App";

type Remap<F extends Type[]> = {
  [P in keyof F]: F[P] extends Type ? InstanceType<F[P]> : never;
};

/**
 * Get a provider dependency from the registered application instance.
 *
 * @param provider - Provider to resolve.
 *
 * @returns Provider instance
 */
export function useProvider<T extends Type>(provider: T): InstanceType<T>;

/**
 * Get multiple provider dependencies from the registered application instance.
 *
 * @param providers - Providers to resolve.
 *
 * @returns List of providers
 */
export function useProvider<Args extends Type[]>(...providers: Args): Remap<Args>;

export function useProvider<Args extends Type[]>(...args: Args): Remap<Args> {
  if (args.length === 1) {
    return app.get(args[0].name);
  }
  return args.map((provide) => app.get(provide.name)) as Remap<Args>;
}
