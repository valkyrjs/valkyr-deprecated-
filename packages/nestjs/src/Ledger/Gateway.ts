import { Inject } from "@nestjs/common";
import { SubscribeMessage } from "@nestjs/websockets";

import { Socket, SocketGateway } from "../Socket";
import { LedgerStreamGuard, STREAM_GUARD } from "./Guards";

export class LedgerGateway extends SocketGateway {
  constructor(@Inject(STREAM_GUARD) private readonly guard: LedgerStreamGuard) {
    super();
  }

  @SubscribeMessage("streams:join")
  public async onJoinStream(socket: Socket, { aggregate, streamId }: any) {
    if (await this.guard.canEnter(aggregate, streamId, socket.auditor)) {
      this.join(socket, `stream:${streamId}`);
    }
  }

  @SubscribeMessage("streams:leave")
  public async onLeaveStream(socket: Socket, { streamId }: any) {
    this.leave(socket, `stream:${streamId}`);
  }
}
