import type { ModelClass } from "@valkyr/db";
import { useEffect, useState } from "react";

import { ApiErrorResponse } from "../Data";
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
export function useQuery<M extends ModelClass>(
  model: M,
  options?: Many
): [InstanceType<M>[], boolean, ApiErrorResponse | undefined];
export function useQuery<M extends ModelClass>(
  model: M,
  options?: Single
): [InstanceType<M> | undefined, boolean, ApiErrorResponse | undefined];
export function useQuery<M extends ModelClass>(
  model: M,
  options: Options = {}
): [InstanceType<M>[] | InstanceType<M> | undefined, boolean, ApiErrorResponse | undefined] {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiErrorResponse | undefined>();

  useEffect(() => {
    if (options.sync !== undefined) {
      options
        .sync()
        .then(() => {
          setLoading(false);
          if (options.singleton === true) {
            return resolveOne(model, options, setData);
          }
          return resolveMany(model, options, setData);
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
      if (options.singleton === true) {
        return resolveOne(model, options, setData);
      }
      return resolveMany(model, options, setData);
    }
  }, [model, JSON.stringify(options)]);

  return [data ? data : options.singleton === true ? undefined : [], loading, error];
}
