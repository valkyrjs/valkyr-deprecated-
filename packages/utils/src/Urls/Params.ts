/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type Parameter = {
  name: string;
  value?: string;
};

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

export function getParsedParameters(path: string): Parameter[] {
  return path.split("/").reduce((list: Parameter[], next: string) => {
    if (next.match(/:/)) {
      list.push({
        name: next.replace(":", ""),
        value: undefined
      });
    }
    return list;
  }, []);
}

export function getParameters<Response = any>(params: Parameter[], match: any): Response {
  const result: any = {};
  params.forEach((param, index) => {
    result[param.name] = match[index + 1];
  });
  return result;
}
