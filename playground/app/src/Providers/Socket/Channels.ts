import type { Service, Socket } from "@valkyr/socket";

/*
 |--------------------------------------------------------------------------------
 | Service
 |--------------------------------------------------------------------------------
 */

export class Channels implements Service {
  private readonly channels = new Set<string>();

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
   | Socket Events
   |--------------------------------------------------------------------------------
   */

  public async onConnect(): Promise<void> {
    for (const channelId of Array.from(this.channels)) {
      this.join(channelId);
    }
  }

  /*
   |--------------------------------------------------------------------------------
   | Utilities
   |--------------------------------------------------------------------------------
   */

  public async join(channelId: string) {
    return this.socket
      .send("channels:join", { channelId })
      .then(() => {
        console.log("joined %s", channelId);
        this.channels.add(channelId);
        return this;
      })
      .catch((error) => {
        console.log("error %s %O", channelId, error);
      });
  }

  public async leave(channelId: string) {
    return this.socket.send("channels:leave", { channelId }).then(() => {
      console.log("left %s", channelId);
      this.channels.delete(channelId);
      return this;
    });
  }
}
