import { hasData } from "../../Policies/hasData";
import { route } from "../../Providers/Server";

/*
 |--------------------------------------------------------------------------------
 | Join
 |--------------------------------------------------------------------------------
 */

route.on("channels.join", [
  hasData(["channelId"]),
  async function (socket, { channelId }) {
    // if (channelId !== "public") {
    //   const permission = access.can("join", "room");
    //   if (!permission.granted) {
    //     return this.reject("You are not authorized to join this channel");
    //   }
    // }
    socket.join(`channel:${channelId}`);
    return this.resolve();
  }
]);

/*
 |--------------------------------------------------------------------------------
 | Message
 |--------------------------------------------------------------------------------
 */

route.on("channels.message", [
  hasData(["channelId", "message"]),
  async function (socket, { channelId, message }) {
    socket.to(`channel:${channelId}`).emit("chat", { message });
    return this.resolve();
  }
]);

/*
 |--------------------------------------------------------------------------------
 | Leave
 |--------------------------------------------------------------------------------
 */

route.on("channels.leave", [
  hasData(["channelId"]),
  async function (socket, { channelId }) {
    socket.leave(`channel:${channelId}`);
    return this.resolve();
  }
]);
