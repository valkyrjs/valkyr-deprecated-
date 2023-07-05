import type { ResolvedValue, Type, ValidationError } from "computed-types";

import { Action, Context as ActionContext } from "./Action";

/*
 |--------------------------------------------------------------------------------
 | Method
 |--------------------------------------------------------------------------------
 |
 | A simple passthrough wrapper constructing a method object that can be consumed
 | by the API server. It provides the handler with the type context resulting from
 | the optional params and actions provided.
 |
 */

export function method<Schema = any, Actions extends Action<any>[] = [], Response = any>({
  params,
  actions,
  handler
}: Props<Schema, Actions, Response>): Method<Schema, Actions, Response> {
  return {
    validate: (params as any)?.destruct(),
    actions,
    handler
  };
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type Method<Schema = any, Actions extends Action<any>[] = [], Response = any> = {
  validate?: (params: any) => [ValidationError, ResolvedValue<Response>];
  actions?: Actions;
  handler: Handler<Schema, Actions, Response>;
};

type Props<Schema = any, Actions extends Action<any>[] = [], Response = any> = {
  params?: Schema;
  actions?: Actions;
  handler: Handler<Schema, Actions, Response>;
};

type Handler<Schema, Actions extends Action<any>[], Response> = (
  ctx: Context<Schema, Actions>,
  req: Partial<ActionContext>
) => Promise<Response> | Response;

type Context<B, A extends Action<any>[]> = Type<B> & ActionsToIntersection<A>;

type ActionsToIntersection<A extends Action<any>[] = []> = A extends undefined | []
  ? {}
  : UnionToIntersection<{ [K in keyof A]: ActionReturnType<A[K]> }[number]>;

type ActionReturnType<T extends Action<any>> = T extends Action<infer P> ? P : Empty;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

type Empty = Record<string, never>;
