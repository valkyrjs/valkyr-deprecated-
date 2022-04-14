import { MongoClient } from "mongodb";

export class Mongo {
  /**
   * Create a new mongodb node.
   *
   * @param name - Database name to run queries against.
   * @param uri  - Database connection endpoint.
   */
  constructor(public readonly name: string, uri: string, public readonly client = new MongoClient(uri)) {}

  /*
   |--------------------------------------------------------------------------------
   | Accessors
   |--------------------------------------------------------------------------------
   */

  public get db() {
    return this.client.db(this.name);
  }

  /*
   |--------------------------------------------------------------------------------
   | Utilities
   |--------------------------------------------------------------------------------
   */

  public async connect() {
    await this.client.connect();
    this.client.on("close", () => {
      this.connect();
    });
    return this;
  }

  /**
   * Returns a reference to a MongoDB Collection. If it does not exist it will be created implicitly.
   *
   * @param name - Name of the collection.
   *
   * @returns MongoDb collection
   */
  public collection<T = any>(name: string) {
    return this.db.collection<T>(name);
  }
}
