import { Collection, collection } from "../Collections";
import type { Options } from "../Types/Query";

export function resolveOne(key: Collection, { filter, observe = true }: Options, setData: React.Dispatch<any>) {
  if (observe) {
    return collection[key].observeOne(filter).subscribe(setData).unsubscribe;
  }
  collection[key].findOne(filter).then(setData);
}

export function resolveMany(key: Collection, { filter, observe = true, ...other }: Options, setData: React.Dispatch<any>) {
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
