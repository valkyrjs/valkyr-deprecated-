import { Query } from "@valkyr/client";
import type { ModelClass } from "@valkyr/db";
import { useEffect, useState } from "react";

/**
 * Perform a query against a [**@valkyr/db**](https://docs.kodemon.net/db) model.
 *
 * @remarks
 *
 * The behavior of this query is dependent on the options provided. The primary behavior difference
 * is when providing the `limit` option.
 *
 * When `limit` is `1` the query will result in a `undefined` or resolved `model`. When `limit` is
 * `0` or larger than `1` the query will result in an array of `models`. By default `limit` is
 * `undefined` and will return an array.
 *
 * Follow the `Options` type for more details on what options are available.
 *
 * @example
 *
 * ```ts
 * const users = useQuery(User); // => User[]
 * const user  = useQuery(User, { limit: 1 }); // => User | undefined
 * ```
 *
 * @param model   - Model to query against.
 * @param options - Query options.
 *
 * @returns Instanced collection model(s)
 */
export function useQuery<M extends ModelClass>(model: M, options?: Query.Single): InstanceType<M> | undefined;
export function useQuery<M extends ModelClass>(model: M, options?: Query.Many): InstanceType<M>[];
export function useQuery<M extends ModelClass>(
  model: M,
  options: Query.Options = {}
): InstanceType<M>[] | InstanceType<M> | undefined {
  const [data, setData] = useState();

  useEffect(() => {
    if (options.limit === 1) {
      return Query.resolveOne(model, options, setData);
    }
    return Query.resolveMany(model, options, setData);
  }, [model, JSON.stringify(options)]);

  return data ? data : options.limit === 1 ? undefined : [];
}
