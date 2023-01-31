"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const event_store_1 = require("@valkyr/event-store");
const jsonrpc_1 = require("@valkyr/jsonrpc");
const ws_1 = require("ws");
const jsonrpc_2 = require("~services/jsonrpc");
const log_1 = require("~services/log");
const events_1 = require("./generated/events");
const database_1 = require("./services/database");
class Api {
    store;
    #methods = new Map();
    constructor(store = new event_store_1.EventStore(database_1.db.collection("events"))) {
        this.store = store;
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
    get event() {
        return events_1.event;
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
    get validator() {
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
    get projector() {
        return this.store.projector;
    }
    register(method, handler) {
        this.#methods.set(method, handler);
        (0, log_1.log)("JsonRpcService", `registered method ${method}`);
    }
    /**
     * Register the API with a fastify server instance.
     *
     * @param fastify - Fastify instance.
     */
    async fastify(fastify) {
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
    async #http(fastify) {
        fastify.post("/rpc", async (req, reply) => {
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
    async #websocket(fastify) {
        const wss = new ws_1.WebSocket.Server({ server: fastify.server });
        wss.on("connection", (socket) => {
            socket.on("message", async (message) => {
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
    async #handleMessage(request, context = {}) {
        try {
            (0, jsonrpc_2.validateRequest)(request);
        }
        catch (error) {
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
                error: new jsonrpc_1.MethodNotFoundError({ method: request.method }),
                id: request.id ?? null
            };
        }
        for (const action of method.actions ?? []) {
            const res = await action.call(jsonrpc_2.response, request, context);
            if (res.status === "reject") {
                return {
                    jsonrpc: "2.0",
                    error: res.error,
                    id: request.id ?? null
                };
            }
        }
        if ("id" in request) {
            (0, log_1.log)("JsonRpcService", "incoming request", request);
            let result;
            try {
                result = {
                    jsonrpc: "2.0",
                    result: await method.handler((request.params ?? context), context),
                    id: request.id
                };
            }
            catch (error) {
                result = {
                    jsonrpc: "2.0",
                    error,
                    id: request.id
                };
            }
            (0, log_1.log)("JsonRpcService", "outgoing response", result);
            return result;
        }
        await method?.handler((request.params ?? context), context);
    }
}
exports.api = new Api();
