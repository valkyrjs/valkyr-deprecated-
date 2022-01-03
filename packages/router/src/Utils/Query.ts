import type { JSONQuery } from "../Types/Query";

/**
 * Takes a key/value pair object and generates a browser query string.
 */
export function toQueryString(obj: JSONQuery): string {
  const query: string[] = [];
  for (const key in obj) {
    query.push(`${key}=${obj[key]}`);
  }
  if (query.length) {
    return `?${query.join("&")}`;
  }
  return "";
}

/**
 * Converts a search string to a object key/value pair.
 */
export function toQueryObject(search: string): JSONQuery {
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
