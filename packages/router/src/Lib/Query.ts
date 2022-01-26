import type { History } from "history";

import type { JSONQuery } from "../Types/Query";
import { toQueryObject, toQueryString } from "../Utils/Query";
import { ValueStore } from "./ValueStore";

export class Query extends ValueStore {
  public readonly history: History;

  /**
   * Create a new `Query` instance.
   *
   * @param history - History instance.
   * @param search  - Query search value.
   */
  constructor(history: History, search = "") {
    super(toQueryObject(search));
    this.history = history;
  }

  /**
   * Update the current query store, and triggers a history push to the
   * new location.
   *
   * @param key   - Key to update the value for.
   * @param value - Value to add to the key.
   */
  public set(key: string | JSONQuery, value?: string | number): void {
    if (typeof key === "string") {
      this.replace({
        ...this.get(),
        [key]: String(value)
      });
    } else {
      this.replace({
        ...this.get(),
        ...key
      });
    }
  }

  /**
   * Remove provided key/value pair from the query store and triggers a
   * history push to the new location.
   *
   * @param key - Key to remove from the query.
   */
  public unset(key?: string | string[]): void {
    if (key !== undefined) {
      this.replace(getSanitizedQuery(key, this.get()));
    } else {
      this.replace({});
    }
  }

  /**
   * Replaces the entire query store with the provided replacement.
   *
   * @param store - Object to replace the current store with.
   */
  public replace(store: any): void {
    this.history.push({ search: toQueryString(store) });
  }

  /**
   * Converts the current query store to a query string.
   *
   * @returns query as a string, eg. ?foo=x&bar=y
   */
  public toString(): string {
    return toQueryString(this.get());
  }
}

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

function getSanitizedQuery(key: string | string[], query: JSONQuery): JSONQuery {
  if (Array.isArray(key)) {
    return removeKeysFromQuery(key, query);
  }
  return removeKeyFromQuery(key, query);
}

function removeKeysFromQuery(keys: string[], query: JSONQuery) {
  for (const key of keys) {
    if (query[key] !== undefined) {
      delete query[key];
    }
  }
  return query;
}

function removeKeyFromQuery(key: string, query: JSONQuery): JSONQuery {
  if (query[key] !== undefined) {
    delete query[key];
  }
  return query;
}
