export type Query = Record<string, string>;

/*
 |--------------------------------------------------------------------------------
 | Query
 |--------------------------------------------------------------------------------
 */

/**
 * Takes a key/value pair object and generates a browser query string.
 */
export function toQueryString(query: Query): string {
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
