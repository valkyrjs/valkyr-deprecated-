import { MongoMemoryServer } from "mongodb-memory-server";

export class MongoDbContainer {
  #server?: MongoMemoryServer;

  get server() {
    if (this.#server === undefined) {
      throw new Error("MongoDBContainer Violation: Server has not been registered, did you start the container?");
    }
    return this.#server;
  }

  get uri() {
    return this.server.getUri();
  }

  async start() {
    this.#server = await MongoMemoryServer.create();
  }

  async close() {
    await this.server.stop();
  }
}
