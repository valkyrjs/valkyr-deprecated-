import { getParsedParameters, Parameter } from "@valkyr/utils";
import { pathToRegexp } from "path-to-regexp";

import type { Action } from "../Types/Action";

export class Route {
  public path: string;
  public actions: Action[];

  public regExp: RegExp;
  public params: Parameter[];

  constructor(path: string, actions: Action[]) {
    this.path = path.replace(/\/$/, "");
    this.actions = actions;
    this.regExp = pathToRegexp(path);
    this.params = getParsedParameters(path);
  }

  public base(path = ""): this {
    this.regExp = pathToRegexp(path + this.path);
    return this;
  }

  public match(path: string): any {
    return this.regExp.exec(path);
  }
}
