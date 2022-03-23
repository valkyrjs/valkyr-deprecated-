import { ModelClass } from "@valkyr/db";
import { useEffect, useState } from "react";

import { Many, Options, resolveMany, resolveOne, Single } from "../Utils/Query";

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
export function useQuery<K extends ModelClass>(model: K, options?: Many): InstanceType<K>[];
export function useQuery<K extends ModelClass>(model: K, options?: Single): InstanceType<K> | undefined;
export function useQuery<K extends ModelClass>(
  model: K,
  options: Options = {}
): InstanceType<K>[] | InstanceType<K> | undefined {
  const [data, setData] = useState();

  useEffect(() => {
    if (options.singleton === true) {
      return resolveOne(model, options, setData);
    }
    return resolveMany(model, options, setData);
  }, [model, JSON.stringify(options)]);

  return data ? data : options.singleton === true ? undefined : [];
}
