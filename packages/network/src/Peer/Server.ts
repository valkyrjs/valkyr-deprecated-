import { EventEmitter } from "@valkyr/utils";
import { DataConnection, Peer, PeerJSOption } from "peerjs";

export abstract class PeerServer<D = unknown, T = unknown> extends EventEmitter {
  #peer: Peer;

  constructor(id: string, options: PeerJSOption) {
    super();
    this.#peer = new Peer(id, options).on("connection", this.#handleConnection.bind(this));
  }

  // ### Accessors

  get id(): string {
    return this.peer.id;
  }

  /**
   * Peer instance assigned to the PeerServer instance.
   */
  get peer(): Peer {
    return this.#peer;
  }

  // ### Abstracts

  /**
   * Resolve incoming requests from connected network peers.
   *
   * @param data - Data to resolve.
   * @param peer - Id of the peer making the request.
   */
  abstract resolve(data: D, peer: string): Promise<T>;

  // ### Utilities

  /**
   * Disconnects the peer form the network.
   */
  close() {
    this.#peer.disconnect();
  }

  // ### Internal Utilities

  #handleConnection(connection: DataConnection): void {
    connection.on("data", (data: string) => {
      this.resolve(JSON.parse(data), connection.peer).then((result) => {
        connection.send(JSON.stringify(result));
      });
    });
  }
}
