import { ApiErrorResponse, Query } from "@valkyr/client";
import type { ModelClass } from "@valkyr/db";
import { useEffect, useState } from "react";

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
  options?: Query.Many
): [InstanceType<M>[], boolean, ApiErrorResponse | undefined];
export function useQuery<M extends ModelClass>(
  model: M,
  options?: Query.Single
): [InstanceType<M> | undefined, boolean, ApiErrorResponse | undefined];
export function useQuery<M extends ModelClass>(
  model: M,
  options: Query.Options = {}
): [InstanceType<M>[] | InstanceType<M> | undefined, boolean, ApiErrorResponse | undefined] {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiErrorResponse | undefined>();

  function resolve() {
    if (options.singleton === true) {
      return Query.resolveOne(model, options, handleData);
    }
    return Query.resolveMany(model, options, handleData);
  }

  function handleData(data: any) {
    setData(data);
    setLoading(false);
  }

  function handleError(err: any) {
    setError(err);
    setLoading(false);
  }

  useEffect(() => {
    if (options.sync !== undefined) {
      options.sync().then(resolve).catch(handleError);
    } else {
      resolve();
    }
  }, [model, JSON.stringify(options)]);

  return [data ? data : options.singleton === true ? undefined : [], loading, error];
}
