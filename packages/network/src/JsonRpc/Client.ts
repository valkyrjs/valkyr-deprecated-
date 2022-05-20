import { nanoid } from "@valkyr/utils";
import { PeerJSOption } from "peerjs";

import { PeerClient } from "../Peer/Client";
import { ErrorResponse, Id, Params, Response } from "./Types";

export class JsonRpcClient extends PeerClient {
  #tasks = new Map<Id, TaskPromise>();

  constructor(id: string, options: PeerJSOption) {
    super(id, options);
    this.on("data", this.#handleData.bind(this));
  }

  notify(peerId: string, method: string, params?: Params): void {
    this.send(peerId, {
      jsonrpc: "2.0",
      method,
      params
    });
  }

  async call<T>(peerId: string, method: string, params?: Params): Promise<Response<T> | ErrorResponse> {
    const id = nanoid();
    return new Promise((resolve, reject) => {
      this.#tasks.set(id, { resolve, reject });
      this.send(peerId, {
        jsonrpc: "2.0",
        method,
        params,
        id
      });
    });
  }

  #handleData(data: Response | ErrorResponse) {
    const task = this.#tasks.get(data.id);
    if (task) {
      if (isErrorResponse(data)) {
        task.resolve(new ErrorResponse(data.error, data.id));
      } else {
        task.resolve(new Response(data.result, data.id));
      }
      this.#tasks.delete(data.id);
    }
  }
}

function isErrorResponse(value: any): value is ErrorResponse {
  return value.error !== undefined;
}

type TaskPromise = {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
};
