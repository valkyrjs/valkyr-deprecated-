import { ErrorResponse, MethodNotFoundError, Notification, Params, Request, SuccessResponse } from "@valkyr/jsonrpc";
import type { FastifyInstance } from "fastify";
import { WebSocket } from "ws";

import { ActionContext, response } from "./action";
import { Method } from "./methods";
import { validateRequest } from "./validate";

export class JsonRpcServer<Methods extends Record<symbol, Method>> {
  constructor(readonly methods: Methods) {
    for (const method in methods) {
      console.log(`Registering method: ${method}`);
    }
    this.plugin = this.plugin.bind(this);
  }

  async plugin(fastify: FastifyInstance): Promise<void> {
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

    const method = this.methods[request.method as any];

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
