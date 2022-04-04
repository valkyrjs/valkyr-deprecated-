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
  /**
   * Mongo query filter used to filter out the returned data. Default: undefined
   */
  filter?: any;

  /**
   * Sort options for array results. Default: undefined
   */
  sort?: QueryOptions["sort"];

  /**
   * Return records after the provided entry number. Default: undefined
   */
  skip?: QueryOptions["skip"];

  /**
   * Limit the number of instances returned. Default: undefined
   */
  limit?: QueryOptions["limit"];

  /**
   * Should we update the resolved result when data changes? Default: true
   */
  observe?: boolean;

  /**
   * Should we return a single instance or array of instances? Default: false
   */
  singleton?: boolean;

  /**
   * Remote sync method to run before resolving the local data. Default: undefined
   */
  sync?: () => Promise<any>;
};

export type Single = Options & {
  singleton: true;
};

export type Many = Options & {
  singleton?: false | undefined;
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
