import type { Location } from "history";

import type { Query } from "./Query";
import type { State } from "./State";
import type { ValueStore } from "./ValueStore";

/*
 |--------------------------------------------------------------------------------
 | Action Response
 |--------------------------------------------------------------------------------
 */

export const response: ActionResponse = {
  render<Props extends RenderProps = RenderProps>(components: any | any[], props: Props = {} as Props): Render<Props> {
    return {
      status: "render",
      components: Array.isArray(components) ? components : [components],
      props
    };
  },

  accept(): Accept {
    return {
      status: "accept"
    };
  },

  redirect(path: string, isExternal = false): Redirect {
    return {
      status: "redirect",
      isExternal,
      path
    };
  },

  reject(message: string, details: any = {}): Reject {
    return {
      status: "reject",
      message,
      details
    };
  }
};

/*
 |--------------------------------------------------------------------------------
 | Errors
 |--------------------------------------------------------------------------------
 */

/**
 * @classdesc
 * Inform the client that an action encountered a failure event.
 */
export class ActionRejectedError extends Error {
  public readonly type = "ActionRejectedError" as const;

  public readonly details: any;

  constructor(message: string, details: any = {}) {
    super(message);
    this.details = details;
  }
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type Action<Props extends RenderProps = RenderProps> = (this: ActionResponse, req: Request) => Response<Props>;

export type Response<Props extends RenderProps = RenderProps> = Promise<Render<Props> | Accept | Redirect | Reject>;

export type Request = {
  location: Location;
  query: Query;
  params: ValueStore;
  state: State;
};

export type RenderProps = Record<string, unknown>;

export type ActionResponse = {
  render<Props extends RenderProps = RenderProps>(components: any | any[], props?: Props): Render<Props>;
  accept(): Accept;
  redirect(path: string, isExternal?: boolean): Redirect;
  reject(message: string, details?: any): Reject;
};

export type Render<Props extends RenderProps = RenderProps, Component = any> = {
  status: "render";
  components: Component[];
  props: Props;
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
