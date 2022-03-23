import type { ModelClass, Options as QueryOptions } from "@valkyr/db";

export type RecordMap<T> = {
  [P in keyof T]: T[P];
};

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

export function resolveOne(model: ModelClass, { filter, observe = true }: Options, setData: React.Dispatch<any>) {
  if (observe) {
    return model.$collection.observeOne(filter).subscribe(setData).unsubscribe;
  }
  model.$collection.findOne(filter).then(setData);
}

export function resolveMany(
  model: ModelClass,
  { filter, observe = true, ...other }: Options,
  setData: React.Dispatch<any>
) {
  if (observe) {
    return model.$collection.observe(filter, getQueryOptions(other)).subscribe(setData).unsubscribe;
  }
  model.$collection.find(filter).then(setData);
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
