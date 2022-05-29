import { SubscribeMessage } from "@nestjs/websockets";

import { Socket, SocketGateway } from "../Socket";
import { LedgerStreamGuard } from "./Guards/LedgerStreamGuards";

export class LedgerGateway extends SocketGateway {
  constructor(readonly guard: LedgerStreamGuard) {
    super();
  }

  @SubscribeMessage("streams:relay")
  public async handleStreamRelay(socket: Socket, { aggregate, streamId, event }: any) {
    if (socket.signature && (await this.guard.canEnter(aggregate, streamId, socket.signature))) {
      this.to(`stream:${streamId}`, [socket]).emit("ledger:event", event);
    }
  }

  @SubscribeMessage("streams:join")
  public async handleJoinStream(socket: Socket, { aggregate, streamId }: any) {
    if (socket.signature && (await this.guard.canEnter(aggregate, streamId, socket.signature))) {
      this.join(socket, `stream:${streamId}`);
    }
  }

  @SubscribeMessage("streams:leave")
  public async handleLeaveStream(socket: Socket, { streamId }: any) {
    this.leave(socket, `stream:${streamId}`);
  }
}
