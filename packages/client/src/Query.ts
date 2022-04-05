import type { ModelClass, Options as QueryOptions } from "@valkyr/db";

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type RecordMap<T> = {
  [P in keyof T]: T[P];
};

export type Options = {
  filter?: any;
  sort?: QueryOptions["sort"];
  skip?: QueryOptions["skip"];
  limit?: QueryOptions["limit"];
  observe?: boolean;
};

export type Single = Options & {
  limit: 1;
};

export type Many = Options & {
  limit?: number;
};

/*
 |--------------------------------------------------------------------------------
 | Resolvers
 |--------------------------------------------------------------------------------
 */

export function resolveOne<M extends ModelClass>(
  model: M,
  { filter, observe = true }: Options,
  setData: React.Dispatch<any>
) {
  if (observe) {
    return model.observeOne(filter).subscribe(setData).unsubscribe;
  }
  model.findOne(filter).then(setData);
}

export function resolveMany<M extends ModelClass>(
  model: M,
  { filter, observe = true, ...other }: Options,
  setData: React.Dispatch<any>
) {
  if (observe) {
    return model.observe(filter, getQueryOptions(other)).subscribe(setData).unsubscribe;
  }
  model.find(filter).then(setData);
}

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

export function getQueryOptions({ sort, skip, limit }: Options): Options | undefined {
  const options: Options = {};
  if (sort) {
    options.sort = sort;
  }
  if (skip !== undefined) {
    options.skip = skip;
  }
  if (limit !== undefined) {
    options.limit = limit;
  }
  if (Object.keys(options).length > 0) {
    return options;
  }
}
