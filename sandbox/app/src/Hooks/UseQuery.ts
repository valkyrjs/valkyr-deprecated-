import { useEffect, useState } from "react";

import type { Collections, Many, Model, Options, Single } from "../Types/Query";
import { resolveMany, resolveOne } from "../Utils/Query";

/**
 * Perform a query against a registered database collection.
 *
 * @remarks
 *
 * The behavior of this query is dependent on the options provided. The primary behavior difference
 * is when providing the `singleton` option.
 *
 * When `singleton` is `true` the query will result in a `undefined` or resolved `model`. When the
 * `singleton` is `false` the query will result in an array of `models`. By default the `singleton`
 * value is `false` and will return an array.
 *
 * Follow the `Options` type for more details on what options are available.
 *
 * @example
 *
 * ```ts
 * const users = useQuery("users"); // => User[]
 * const user = useQuery("users", { singleton: true }); // => User | undefined
 * ```
 *
 * @param key     - Database collection to query.
 * @param options - Provided query options.
 *
 * @returns Instanced collection model(s)
 */
export function useQuery<K extends keyof Collections, T extends Model<K>>(key: K, options?: Many): T[];
export function useQuery<K extends keyof Collections, T extends Model<K>>(key: K, options?: Single): T | undefined;
export function useQuery<K extends keyof Collections, T extends Model<K>>(key: K, options: Options = {}): T[] | T | undefined {
  const [data, setData] = useState();

  useEffect(() => {
    if (options.singleton === true) {
      return resolveOne(key, options, setData);
    }
    return resolveMany(key, options, setData);
  }, [key, JSON.stringify(options)]);

  return data ? data : options.singleton === true ? undefined : [];
}
