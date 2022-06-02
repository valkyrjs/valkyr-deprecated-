import { MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";

export class MongoDbTestContainer {
  private constructor(readonly server: MongoMemoryServer, readonly client: MongoClient) {}

  static async start() {
    const server = await MongoMemoryServer.create();
    const client = await MongoClient.connect(server.getUri());
    return new MongoDbTestContainer(server, client);
  }

  get name() {
    if (this.server.instanceInfo === undefined) {
      throw new Error("MongoDbTestContainer Violation: Could not resolve database name");
    }
    return this.server.instanceInfo.dbName;
  }

  get db() {
    return this.client.db(this.name);
  }

  get collection() {
    return this.db.collection.bind(this.db);
  }

  async stop() {
    await this.client.close();
    await this.server.stop();
  }
}
