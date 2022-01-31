import type { Options as QueryOptions } from "@valkyr/db";

import { Collection, collection } from "../Collections";

export type RecordMap<T> = {
  [P in keyof T]: T[P];
};

export type Collections = RecordMap<typeof collection>;

export type Model<K extends keyof Collections> = InstanceType<Collections[K]["model"]>;

export type Options = {
  filter?: any;
  sort?: QueryOptions["sort"];
  skip?: QueryOptions["skip"];
  limit?: QueryOptions["limit"];
  observe?: boolean;
  singleton?: boolean;
};

export type Single = Options & {
  singleton: true;
};

export type Many = Options & {
  singleton?: false | undefined;
};

export function resolveOne(key: Collection, { filter, observe = true }: Options, setData: React.Dispatch<any>) {
  if (observe) {
    return collection[key].observeOne(filter).subscribe(setData).unsubscribe;
  }
  collection[key].findOne(filter).then(setData);
}

export function resolveMany(
  key: Collection,
  { filter, observe = true, ...other }: Options,
  setData: React.Dispatch<any>
) {
  if (observe) {
    return collection[key].observe(filter, getQueryOptions(other)).subscribe(setData).unsubscribe;
  }
  collection[key].find(filter).then(setData);
}

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
