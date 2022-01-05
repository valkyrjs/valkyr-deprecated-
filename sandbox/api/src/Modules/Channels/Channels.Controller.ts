import { WsAction } from "@valkyr/server";

/*
 |--------------------------------------------------------------------------------
 | Join
 |--------------------------------------------------------------------------------
 */

export const join: WsAction<{ channelId: string }> = async function (socket, { channelId }) {
  // if (channelId !== "public") {
  //   const permission = access.can("join", "room");
  //   if (!permission.granted) {
  //     return this.reject("You are not authorized to join this channel");
  //   }
  // }
  socket.join(`channel:${channelId}`);
  return this.resolve();
};

/*
 |--------------------------------------------------------------------------------
 | Message
 |--------------------------------------------------------------------------------
 */

export const message: WsAction<{ channelId: string; message: string }> = async function (socket, { channelId, message }) {
  socket.to(`channel:${channelId}`).emit("chat", { message });
  return this.resolve();
};

/*
 |--------------------------------------------------------------------------------
 | Leave
 |--------------------------------------------------------------------------------
 */

export const leave: WsAction<{ channelId: string }> = async function (socket, { channelId }) {
  socket.leave(`channel:${channelId}`);
  return this.resolve();
};
