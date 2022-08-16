import { RawObject } from "mingo/types";
import { useEffect, useState } from "react";

import type { ModelClass, SubscribeToMany, SubscribeToSingle, SubscriptionOptions } from "../dist";

/**
 * Perform a query against a [**@valkyr/db**](https://docs.valkyrjs.com/db) model.
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
 * @example
 *
 * ```ts
 * const users = useQuery(User); // => User[]
 * const user  = useQuery(User, { limit: 1 }); // => User | undefined
 * ```
 *
 * @param model - Model to query against.
 * @param query - Query details.
 *
 * @returns Instanced collection model(s)
 */
export function useQuery<M extends ModelClass>(
  model: M,
  query: QuerySingle
): [InstanceType<M> | undefined, boolean, Error | undefined];
export function useQuery<M extends ModelClass>(model: M): [InstanceType<M>[], boolean, Error | undefined];
export function useQuery<M extends ModelClass>(
  model: M,
  query: QueryMany
): [InstanceType<M>[], boolean, Error | undefined];
export function useQuery<M extends ModelClass>(model: M, query: Query = {}) {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    const { where, observe = true, ...options } = query;
    if (observe === true) {
      const subscription = (model as any).subscribe(where, options, (data: any): void => {
        setData(data);
        setLoading(false);
      });
      return (): void => {
        subscription.unsubscribe();
      };
    }
    if (options.limit === 1) {
      model
        .findOne(where)
        .then((data) => {
          setData(data);
          setLoading(false);
        })
        .catch(setError);
    } else {
      model
        .find(where)
        .then((data) => {
          setData(data);
          setLoading(false);
        })
        .catch(setError);
    }
  }, [model, JSON.stringify(query)]);

  return [data ? data : query.limit === 1 ? undefined : [], loading, error];
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type Query = Where & SubscriptionOptions;

type QuerySingle = Where & SubscribeToSingle;

type QueryMany = Where & SubscribeToMany;

type Where = {
  where?: RawObject;
  observe?: boolean;
};
