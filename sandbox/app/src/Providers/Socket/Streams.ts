import type { Service, Socket } from "@valkyr/socket";

/*
 |--------------------------------------------------------------------------------
 | Service
 |--------------------------------------------------------------------------------
 */

export class Streams implements Service {
  private readonly streams = new Set<string>();

  constructor(public readonly socket: Socket) {}

  /*
   |--------------------------------------------------------------------------------
   | Factories
   |--------------------------------------------------------------------------------
   */

  public static create(socket: Socket) {
    return new this(socket);
  }

  /*
   |--------------------------------------------------------------------------------
   | Accessors
   |--------------------------------------------------------------------------------
   */

  public get streamsIds(): string[] {
    return Array.from(this.streams);
  }

  /*
   |--------------------------------------------------------------------------------
   | Socket Events
   |--------------------------------------------------------------------------------
   */

  public async onConnect(): Promise<void> {
    for (const entityId of Array.from(this.streams)) {
      this.join(entityId);
    }
  }

  /*
   |--------------------------------------------------------------------------------
   | Utilities
   |--------------------------------------------------------------------------------
   */

  public async join(entityId: string) {
    return this.socket
      .send("streams.join", { entityId })
      .then(() => {
        console.log("joined %s", entityId);
        this.streams.add(entityId);
        return this;
      })
      .catch((error) => {
        console.log("error %s %O", entityId, error);
      });
  }

  public async leave(entityId: string) {
    return this.socket.send("streams.leave", { entityId }).then(() => {
      console.log("left %s", entityId);
      this.streams.delete(entityId);
      return this;
    });
  }
}
