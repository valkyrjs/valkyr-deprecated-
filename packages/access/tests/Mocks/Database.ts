import { MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";

import { access } from "../../src";

export class MongoDbTestContainer {
  private constructor(public readonly server: MongoMemoryServer, public readonly client: MongoClient) {}

  public static async start() {
    const server = await MongoMemoryServer.create();
    const client = await MongoClient.connect(server.getUri());

    await access.setup(client.db(server.instanceInfo!.dbName));

    return new MongoDbTestContainer(server, client);
  }

  public get collection() {
    return this.client
      .db(this.server.instanceInfo!.dbName)
      .collection.bind(this.client.db(this.server.instanceInfo!.dbName));
  }

  public async stop() {
    await this.client.close();
    await this.server.stop();
  }
}
