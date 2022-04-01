import { MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";

export class MongoDbTestContainer {
  private constructor(public readonly server: MongoMemoryServer, public readonly client: MongoClient) {}

  public static async start() {
    const server = await MongoMemoryServer.create();
    const client = await MongoClient.connect(server.getUri());
    return new MongoDbTestContainer(server, client);
  }

  public get name() {
    if (this.server.instanceInfo === undefined) {
      throw new Error("MongoDbTestContainer Violation: Could not resolve database name");
    }
    return this.server.instanceInfo.dbName;
  }

  public get db() {
    return this.client.db(this.name);
  }

  public get collection() {
    return this.db.collection.bind(this.db);
  }

  public async stop() {
    await this.client.close();
    await this.server.stop();
  }
}
