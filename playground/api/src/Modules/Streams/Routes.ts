import { Event } from "stores";

import { collection } from "../../Collections";
import { hasData } from "../../Policies/hasData";
import { route } from "../../Providers/Server";

// store.on("saved", (descriptor) => {
//   for (const stream of descriptor.streams) {
//     wss.to(`stream:${stream}`).emit("event", descriptor);
//   }
// });

/*
 |--------------------------------------------------------------------------------
 | Push
 |--------------------------------------------------------------------------------
 */

route.on<{ events: Event[] }>("streams:push", [
  hasData(["events"]),
  async function (socket, { events }) {
    // const permission = socket.auth.access.get(descriptor.stream).can("add", descriptor.event.type);
    // if (!permission.granted) {
    //   return this.reject("You are not authorized to add this event to the stream");
    // }
    for (const event of events) {
      try {
        // await store.insert(event);
        socket.to(`stream:${event.streamId}`).emit("event", event);
      } catch (error) {
        return this.reject(400, error.message);
      }
    }
    return this.resolve();
  }
]);

/*
 |--------------------------------------------------------------------------------
 | Pull
 |--------------------------------------------------------------------------------
 */

route.on<{ streamId: string; recorded?: string }>("streams:pull", [
  hasData(["streamId"]),
  async function (_, { streamId, recorded }) {
    // const permission = socket.auth.access.get(stream).can("get", "events");
    // if (!permission.granted) {
    //   return this.reject("You are not authorized to get events on this stream");
    // }
    const filter: any = { streamId };
    if (recorded) {
      filter.recorded = {
        $gt: recorded
      };
    }
    return this.resolve(await collection.events.find(filter).sort({ recorded: 1 }).toArray());
  }
]);

/*
 |--------------------------------------------------------------------------------
 | Join
 |--------------------------------------------------------------------------------
 */

route.on<{ streamId: string }>("streams:join", [
  hasData(["streamId"]),
  async function (socket, { streamId }) {
    // const permission = socket.auth.access.get(streamId).can("join", "stream");
    // if (!permission.granted) {
    //   return this.reject("You are not authorized to join this stream");
    // }
    socket.join(`stream:${streamId}`);
    return this.resolve();
  }
]);

/*
 |--------------------------------------------------------------------------------
 | Leave
 |--------------------------------------------------------------------------------
 */

route.on<{ streamId: string }>("streams:leave", [
  hasData(["streamId"]),
  async function (socket, { streamId }) {
    socket.leave(`stream:${streamId}`);
    return this.resolve();
  }
]);
