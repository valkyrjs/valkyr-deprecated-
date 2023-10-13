import { TypeOf, z, ZodObject, ZodRawShape, ZodTypeAny } from "zod";

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

export function method<Schema extends ZodRawShape = ZodRawShape, Actions extends Action<any>[] = [], Response = any>({
  params = {} as unknown as Schema,
  actions,
  handler
}: Props<Schema, Actions, Response>): Method<ZodObject<Schema>, Actions, Response> {
  return {
    params: z.object(params).strict(),
    actions,
    handler
  };
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type Method<Schema extends ZodTypeAny = ZodTypeAny, Actions extends Action<any>[] = [], Response = any> = {
  params: Schema;
  actions?: Actions;
  handler: Handler<Schema, Actions, Response>;
};

type Props<Schema extends ZodRawShape = ZodRawShape, Actions extends Action<any>[] = [], Response = any> = {
  params?: Schema;
  actions?: Actions;
  handler: Handler<ZodObject<Schema>, Actions, Response>;
};

type Handler<Schema extends ZodTypeAny, Actions extends Action<any>[], Response> = (
  ctx: Context<Schema, Actions>,
  req: Partial<ActionContext>
) => Promise<Response> | Response;

type Context<B extends ZodTypeAny, A extends Action<any>[]> = TypeOf<B> & ActionsToIntersection<A>;

type ActionsToIntersection<A extends Action<any>[] = []> = A extends undefined | []
  ? {}
  : UnionToIntersection<{ [K in keyof A]: ActionReturnType<A[K]> }[number]>;

type ActionReturnType<T extends Action<any>> = T extends Action<infer P> ? P : Empty;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

type Empty = Record<string, never>;
