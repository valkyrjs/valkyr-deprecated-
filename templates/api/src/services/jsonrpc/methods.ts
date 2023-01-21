import { Params } from "@valkyr/jsonrpc";

import { Action, ActionContext } from "./action";

/**
 * Register a method handler.
 *
 * @param method  - Method to register the handler for.
 * @param handler - Handler to register.
 * @param actions - List of actions to execute before the handler. (Optional)
 */
export function method<P extends Params | void = void, R = void>(handler: Handler<P, R>): Method<P, R>;
export function method<P extends Params | void = void, R = void>(
  actions: Action[],
  handler: Handler<P, R>
): Method<P, R>;
export function method<P extends Params | void = void, R = void>(...args: any[]): Method<P, R> {
  return {
    actions: Array.isArray(args[0]) ? args[0] : [],
    handler: Array.isArray(args[0]) ? args[1] : args[0]
  };
}

export type Method<P extends Params | void = void, R = void> = {
  actions?: Action[];
  handler: Handler<P, R>;
};

type Handler<P extends Params | void = void, Result = void> = Result extends void
  ? NotificationHandler<P>
  : RequestHandler<P, Result>;

export type NotificationHandler<P extends Params | void = void> = Params extends void
  ? (ctx: ActionContext) => Promise<void>
  : (params: P, ctx: ActionContext) => Promise<void>;

export type RequestHandler<P extends Params | void = void, Result = void> = Params extends void
  ? (ctx: ActionContext) => Promise<Result>
  : (params: P, ctx: ActionContext) => Promise<Result>;
