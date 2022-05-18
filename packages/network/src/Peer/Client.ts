import { EventEmitter } from "@valkyr/utils";
import { DataConnection, Peer, PeerJSOption } from "peerjs";

export class PeerClient extends EventEmitter {
  #peer: Peer;
  #connections = new Map<string, DataConnection>();

  constructor(id: string, options: PeerJSOption) {
    super();
    this.#peer = new Peer(id, options);
  }

  // ### Accessors

  get id() {
    return this.client.id;
  }

  /**
   * Client represents the established Peer instance on behalf
   * of the PeerClient instance.
   *
   * @see {@link https://peerjs.com/docs/#peer}
   */
  get client() {
    return this.#peer;
  }

  // ### Network Utilities

  /**
   * Connect to a peer and send a message once a connection has
   * been established.
   *
   * @param id   - Id of the peer to connect to.
   * @param data - Data to send to the receiving peer.
   */
  send(id: string, data: object): void {
    this.#connect(id, (connection) => {
      connection.send(JSON.stringify(data));
    });
  }

  // ### Internal Utilities

  #connect(id: string, cb: (connection: DataConnection) => void): void {
    const connection = this.#getConnection(id);
    if (connection.open === false) {
      connection.once("open", () => cb(connection));
    } else {
      cb(connection);
    }
  }

  #setConnection(id: string, connection: DataConnection): DataConnection {
    this.#connections.set(id, connection);
    return connection;
  }

  #getConnection(id: string): DataConnection {
    const cached = this.#connections.get(id);
    if (cached) {
      return cached;
    }

    const connection = this.#setConnection(id, this.#peer.connect(id));

    connection.on("open", () => {
      this.emit("opened", id);
    });

    connection.on("data", (data: string) => {
      this.emit("data", JSON.parse(data));
    });

    connection.on("error", (error) => {
      this.emit("error", error);
    });

    connection.on("close", () => {
      this.emit("closed", id);
      this.#delConnection(id);
    });

    return connection;
  }

  #delConnection(id: string): void {
    this.#connections.delete(id);
  }
}
