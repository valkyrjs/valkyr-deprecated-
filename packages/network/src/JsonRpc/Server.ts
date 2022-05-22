import { PeerServer } from "../Peer/Server";
import { JsonRpcError, MethodNotFoundError, ServerError } from "./Errors";
import { ErrorResponse, Request, Response } from "./Types";

export class JsonRpcServer extends PeerServer<Request, Response | ErrorResponse> {
  #methods = new Map<string, JsonRpcMethod>();

  method(method: string, handler: JsonRpcMethod) {
    this.#methods.set(method, handler);
  }

  async resolve(request: Request, peer: string): Promise<Response | ErrorResponse> {
    const method = this.#methods.get(request.method);
    if (!method) {
      return new ErrorResponse(new MethodNotFoundError(), request.id);
    }
    try {
      return new Response(await method(request.params, peer), request.id);
    } catch (error) {
      if (error instanceof JsonRpcError) {
        return new ErrorResponse(error, request.id);
      }
      return new ErrorResponse(new ServerError(-32000), request.id);
    }
  }
}

export type JsonRpcMethod<T = unknown> = (params: any, peer: string) => Promise<T>;
