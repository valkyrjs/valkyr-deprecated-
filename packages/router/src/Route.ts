import { match, pathToRegexp } from "path-to-regexp";

import { Action } from "./Action.js";

/*
 |--------------------------------------------------------------------------------
 | Route
 |--------------------------------------------------------------------------------
 */

export class Route {
  readonly id?: string;
  readonly name?: string;
  readonly children?: Route[];
  readonly actions: readonly Action[];

  #parser?: RegExp;
  #base?: string;
  #path?: string;
  #parent?: Route;

  constructor({ id, name, path, base, children, actions }: RouteOptions) {
    this.id = id;
    this.name = name;
    this.children = children;
    this.actions = actions;
    this.#base = base;
    this.#path = path;
  }

  set parent(parent: Route | undefined) {
    this.#parent = parent;
  }

  get parent(): Route | undefined {
    return this.#parent;
  }

  get path(): string {
    return `${this.#base ?? ""}${this.#parent?.path ?? ""}${this.#path ?? ""}`.replace(/\/$/, "");
  }

  register(base?: string): this {
    if (this.#path !== undefined) {
      this.#base = base;
      this.#parser = pathToRegexp(this.path);
    }
    return this;
  }

  match(path: string): false | Object {
    if (this.#parser === undefined) {
      return false;
    }
    const matched = this.#parser.exec(path);
    if (matched !== null) {
      const res = match(this.path)(path);
      if (res === false) {
        return {};
      }
      return res.params;
    }
    return false;
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
  path?: string;
  base?: string;
  children?: Route[];
  actions: Action[];
};

export type Parameter = {
  name: string;
  value?: string;
};
