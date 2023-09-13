import {
  ErrorResponse,
  InternalError,
  InvalidParamsError,
  MethodNotFoundError,
  Notification,
  Params,
  Request,
  RpcError,
  SuccessResponse
} from "@valkyr/jsonrpc";
import { FastifyInstance } from "fastify";
import { WebSocket } from "ws";

import { Context, response } from "./Action";
import { Method } from "./Method";
import { validateRequest } from "./Validate";

export class Api {
  #methods = new Map<string, Method>();

  constructor() {
    this.fastify = this.fastify.bind(this);
  }

  /*
   |--------------------------------------------------------------------------------
   | Fastify Handlers
   |--------------------------------------------------------------------------------
   */

  /**
   * Inject API instance with Fastify server.
   *
   * @param fastify - Fastify server instance.
   */
  async fastify(fastify: FastifyInstance): Promise<void> {
    await this.#http(fastify);
    await this.#websocket(fastify);
  }

  /*
   |--------------------------------------------------------------------------------
   | Method Handlers
   |--------------------------------------------------------------------------------
   */

  /**
   * Register a method to the API instance.
   *
   * @param name   - Name of the method.
   * @param method - Method handler configuration.
   */
  register<M extends Method<any, any, any>>(name: string, method: M): void {
    this.#methods.set(name, method);
  }

  /*
   |--------------------------------------------------------------------------------
   | Request Handlers
   |--------------------------------------------------------------------------------
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
   * Handle JSON RPC request and return a result. When a Notification is provided
   * the result will be `undefined`.
   *
   * @param request - JSON RPC request or notification.
   * @param context - Request context to be passed to the method handler.
   */
  async #handleMessage(
    request: Request<Params> | Notification<Params>,
    context: Partial<Context> = {}
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

    // ### Retrieve Method

    const method = this.#methods.get(request.method);
    if (method === undefined) {
      return {
        jsonrpc: "2.0",
        error: new MethodNotFoundError({ method: request.method }),
        id: (request as any).id ?? null
      };
    }

    // ### Validate Parameters

    if (method.validate !== undefined) {
      const [err] = method.validate(request.params ?? {});
      if (err) {
        return {
          jsonrpc: "2.0",
          error: new InvalidParamsError(err.message),
          id: (request as any).id ?? null
        };
      }
    }

    // ### Run Actions

    for (const action of method.actions ?? []) {
      const result = await (action as any)(context, response);
      if (result.status === "reject") {
        return {
          jsonrpc: "2.0",
          error: result.error,
          id: (request as any).id ?? null
        };
      }
      for (const key in result.params) {
        (request.params as any)[key] = result.params[key];
      }
    }

    // ### Handle Request

    if ("id" in request) {
      let result: any;
      try {
        result = {
          jsonrpc: "2.0",
          result: await method.handler(request.params ?? {}, context),
          id: request.id
        };
      } catch (error) {
        result = {
          jsonrpc: "2.0",
          error: error instanceof RpcError ? error : new InternalError(error.message),
          id: request.id
        };
      }
      return result;
    }

    method?.handler(request.params ?? {}, context);
  }
}
