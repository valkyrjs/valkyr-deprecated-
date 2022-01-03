import type { Location } from "history";

import type { Query } from "../Lib/Query";
import type { State } from "../Lib/State";
import type { ValueStore } from "../Lib/ValueStore";

export type Action = (this: ActionResponse, req: Request) => Response;

export type Response = Promise<Render | Accept | Redirect | Reject>;

export type Request = {
  location: Location;
  query: Query;
  params: ValueStore;
  state: State;
};

export type ActionResponse = {
  render(components: any | any[]): Render;
  accept(): Accept;
  redirect(path: string, isExternal?: boolean): Redirect;
  reject(message: string, details?: any): Reject;
};

export type Render = {
  status: "render";
  components: any[];
};

export type Accept = {
  status: "accept";
};

export type Redirect = {
  status: "redirect";
  isExternal: boolean;
  path: string;
};

export type Reject = {
  status: "reject";
  message: string;
  details: any;
};
