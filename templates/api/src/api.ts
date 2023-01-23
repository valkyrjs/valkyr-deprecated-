import { EventStore } from "@valkyr/event-store";
import { ErrorResponse, MethodNotFoundError, Notification, Params, Request, SuccessResponse } from "@valkyr/jsonrpc";
import { Projector, Validator } from "@valkyr/ledger";
import { FastifyInstance } from "fastify";
import { WebSocket } from "ws";

import { ActionContext, Method, response, validateRequest } from "~services/jsonrpc";

import { event, EventFactory, EventRecord } from "./generated/events";
import { db } from "./services/database";

class Api {
  #methods = new Map<string, Method<any, any>>();

  constructor(readonly store = new EventStore<"server", EventRecord>(db.collection<EventRecord>("events"))) {
    this.fastify = this.fastify.bind(this);
  }

  /**
   * Generated event factory used for creating new events.
   *
   * @see https://docs.valkyrjs.com/
   *
   * @example
   * ```ts
   * await api.store.push("stream", api.event.fooCreated({ bar: "foobar" }));
   * ```
   */
  get event(): EventFactory {
    return event;
  }

  /**
   * Event validator used to confirm the validity of new events before they are
   * committed to the event store.
   *
   * @see https://docs.valkyrjs.com/
   *
   * @example
   * ```ts
   * await api.validator.on("FooCreated", async (event) => {
   *   // throw error on invalidation or do nothing to allow event to be committed
   * })
   * ```
   */
  get validator(): Validator<EventRecord> {
    return this.store.validator;
  }

  /**
   * Event projector used to inform read side services of new events which it can
   * use to perform subsequent actions and persist data to optimized storage
   * solutions.
   *
   * @see https://docs.valkyrjs.com/
   *
   * @example
   * ```ts
   * await api.projector.once("FooCreated", async (event) => {
   *   // create side effect(s) for an event seen for the first time here
   * });
   *
   * await api.projector.on("FooCreated", async (event) => {
   *   // create side effect(s) for an event seen for the first time or
   *   // is newer than the last seen event of the same type for the same
   *   // stream here
   * });
   *
   * await api.projector.all("FooCreated", async (event) => {
   *   // create side effect(s) for an event without any restrictions
   * });
   * ```
   */
  get projector(): Projector<EventRecord> {
    return this.store.projector;
  }

  register<P extends void | Params = void, R = void>(method: string, handler: Method<P, R>): void {
    console.log(`Registering method '${method}'`);
    this.#methods.set(method, handler);
  }

  /**
   * Register the API with a fastify server instance.
   *
   * @param fastify - Fastify instance.
   */
  async fastify(fastify: FastifyInstance): Promise<void> {
    await this.#http(fastify);
    await this.#websocket(fastify);
  }

  /**
   * Register HTTP(s) functionality with a fastify instance.
   *
   * @example
   * ```ts
   * import { http } from "@valkyr/api"
   * import Fastify from "fastify"
   *
   * const fastify = Fastify();
   *
   * fastify.register(http);
   * ```
   */
  async #http(fastify: FastifyInstance): Promise<void> {
    fastify.post<{
      Body: Request<Params> | Notification<Params>;
    }>("/rpc", async (req, reply) => {
      const result = await this.#handleMessage(req.body, { headers: req.headers });
      if (result) {
        return reply.status(200).send(result);
      }
      return reply.status(204).send();
    });
  }

  /**
   * Register WebSocket functionality with a fastify instance.
   *
   * @example
   * ```ts
   * import { websocket } from "@valkyr/api"
   * import Fastify from "fastify"
   *
   * const fastify = Fastify();
   *
   * fastify.register(websocket);
   * ```
   */
  async #websocket(fastify: FastifyInstance): Promise<void> {
    const wss = new WebSocket.Server({ server: fastify.server });
    wss.on("connection", (socket) => {
      socket.on("message", async (message: Request<Params> | Notification<Params>) => {
        const request = JSON.parse(message.toString());
        const result = await this.#handleMessage(request, { headers: {}, socket });
        if (result !== undefined) {
          socket.send(JSON.stringify(result));
        }
      });
    });
  }

  /**
   * Handle JSON RPC request and return a result.
   *
   * @remarks When a Notification is provided the result will be undefined.
   *
   * @param request - JSON RPC request or notification.
   * @param auth    - JSON Web Token.
   * @param socket  - WebSocket connection.
   */
  async #handleMessage(
    request: Request<Params> | Notification<Params>,
    context: Partial<ActionContext> = {}
  ): Promise<SuccessResponse | ErrorResponse | undefined> {
    try {
      validateRequest(request);
    } catch (error) {
      return {
        jsonrpc: "2.0",
        error,
        id: null
      };
    }

    const method = this.#methods.get(request.method);

    if (method === undefined) {
      return {
        jsonrpc: "2.0",
        error: new MethodNotFoundError({ method: request.method }),
        id: (request as any).id ?? null
      };
    }

    for (const action of method.actions ?? []) {
      const res = await action.call(response, request as any, context as any);
      if (res.status === "reject") {
        return {
          jsonrpc: "2.0",
          error: res.error,
          id: (request as any).id ?? null
        };
      }
    }

    if ("id" in request) {
      try {
        return {
          jsonrpc: "2.0",
          result: await method.handler((request.params ?? context) as any, context as any),
          id: request.id
        };
      } catch (error) {
        return {
          jsonrpc: "2.0",
          error,
          id: request.id
        };
      }
    }

    await method?.handler((request.params ?? context) as any, context as any);
  }
}

export const api = new Api();
