import { match, pathToRegexp } from "path-to-regexp";

import { Action } from "./Action";

/*
 |--------------------------------------------------------------------------------
 | Route
 |--------------------------------------------------------------------------------
 */

export class Route {
  readonly id?: string;
  readonly name?: string;
  readonly children?: Route[];
  readonly actions: Action[];

  path!: string;
  parser!: RegExp;

  parent?: Route;

  #base?: string;

  constructor({ id, name, path = "", base, children, actions }: RouteOptions) {
    this.id = id;
    this.name = name;
    this.children = children;
    this.actions = actions;
    this.#base = base;
    this.#setPath(path);
  }

  get redirect(): string | undefined {
    if (this.#base !== undefined) {
      return `${this.path}${this.#base}`;
    }
  }

  register(options: RegisterOptions): this {
    this.#setBase(options.base);
    this.#setParent(options.parent);
    return this;
  }

  match(path: string): false | Object {
    const matched = this.parser.exec(path);
    if (matched !== null) {
      const res = match(this.path)(path);
      if (res === false) {
        return {};
      }
      return res.params;
    }
    return false;
  }

  #setBase(path = ""): this {
    this.#setPath(`${path}${this.path}`);
    return this;
  }

  #setParent(route?: Route): this {
    this.parent = route;
    return this;
  }

  #setPath(path: string) {
    this.path = path.replace(/\/$/, "");
    this.parser = pathToRegexp(path);
  }
}

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

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type RouteOptions = {
  id?: string;
  name?: string;
  path: string;
  base?: string;
  children?: Route[];
  actions: Action[];
};

export type RegisterOptions = {
  base: string;
  parent?: Route;
};

export type Parameter = {
  name: string;
  value?: string;
};
