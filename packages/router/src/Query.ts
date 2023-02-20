import type { History } from "history";

import { ValueStore } from "./ValueStore.js";

export class Query extends ValueStore {
  readonly history: History;

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
  set(key: string | JSONQuery, value?: string | number): void {
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
  unset(key?: string | string[]): void {
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
  replace(store: any): void {
    this.history.push({ search: toQueryString(store) });
  }

  /**
   * Converts the current query store to a query string.
   *
   * @returns query as a string, eg. ?foo=x&bar=y
   */
  toString(): string {
    return toQueryString(this.get());
  }
}

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

/**
 * Takes a key/value pair object and generates a browser query string.
 */
export function toQueryString(query: JSONQuery): string {
  const search: string[] = [];
  for (const key in query) {
    search.push(`${key}=${query[key]}`);
  }
  if (search.length) {
    return `?${search.join("&")}`;
  }
  return "";
}

/**
 * Converts a search string to a object key/value pair.
 */
export function toQueryObject(search: string): Query {
  const result: any = {};
  if (search) {
    search
      .replace("?", "")
      .split("&")
      .forEach((filter: string): void => {
        const [key, val] = filter.split(/=(.+)/);
        result[key] = val;
      });
  }
  return result;
}

function getSanitizedQuery(key: string | string[], query: JSONQuery): JSONQuery {
  if (Array.isArray(key)) {
    return removeKeysFromQuery(key, query);
  }
  return removeKeyFromQuery(key, query);
}

function removeKeysFromQuery(keys: string[], query: JSONQuery) {
  for (const key of keys) {
    removeKeyFromQuery(key, query);
  }
  return query;
}

function removeKeyFromQuery(key: string, query: JSONQuery): JSONQuery {
  if (query[key] !== undefined) {
    delete query[key];
  }
  return query;
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type JSONQuery = Record<string, string>;
