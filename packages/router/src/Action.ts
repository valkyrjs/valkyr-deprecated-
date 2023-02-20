import type { Resolved } from "./Resolved.js";

/*
 |--------------------------------------------------------------------------------
 | Action Response
 |--------------------------------------------------------------------------------
 */

export const response: ActionResponse = {
  render<Props extends RenderProps = RenderProps>(component: unknown, props: Props = {} as Props): Render<Props> {
    return {
      status: "render",
      component,
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
 | Types
 |--------------------------------------------------------------------------------
 */

export type Action<Props extends RenderProps = RenderProps> = (
  this: ActionResponse,
  resolved: Resolved
) => Response<Props>;

export type Response<Props extends RenderProps = RenderProps> = Promise<Render<Props> | Accept | Redirect | Reject>;

export type RenderProps = Record<string, unknown>;

export type ActionResponse = {
  render<Props extends RenderProps = RenderProps>(component: any, props?: Props): Render<Props>;
  accept(): Accept;
  redirect(path: string, isExternal?: boolean): Redirect;
  reject(message: string, details?: any): Reject;
};

export type Render<Props extends RenderProps = RenderProps, Component = any> = {
  status: "render";
  component: Component;
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
