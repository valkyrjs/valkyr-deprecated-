type Query = Record<string, string>;

/*
 |--------------------------------------------------------------------------------
 | Query
 |--------------------------------------------------------------------------------
 */

export function getQuery(search = ""): Query {
  const query: Query = {};
  if (search) {
    search
      .replace("?", "")
      .split("&")
      .forEach((filter: string): void => {
        const [key, val] = filter.split(/=(.+)/);
        query[key] = val;
      });
  }
  return query;
}
