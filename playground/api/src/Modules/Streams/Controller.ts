import type { WsAction } from "@valkyr/server";
import { Event } from "stores";

import { collection } from "../../Collections";

/*
 |--------------------------------------------------------------------------------
 | Push
 |--------------------------------------------------------------------------------
 */

export const push: WsAction<{ events: Event[] }> = async function (socket, { events }) {
  // const permission = socket.auth.access.get(descriptor.stream).can("add", descriptor.event.type);
  // if (!permission.granted) {
  //   return this.reject("You are not authorized to add this event to the stream");
  // }
  for (const event of events) {
    try {
      // await store.insert(event);
      socket.to(`stream:${event.entityId}`).emit("event", event);
    } catch (error) {
      return this.reject(400, error.message);
    }
  }
  return this.resolve();
};

/*
 |--------------------------------------------------------------------------------
 | Pull
 |--------------------------------------------------------------------------------
 */

export const pull: WsAction<{ entityId: string; recorded?: string }> = async function (_, { entityId, recorded }) {
  // const permission = socket.auth.access.get(stream).can("get", "events");
  // if (!permission.granted) {
  //   return this.reject("You are not authorized to get events on this stream");
  // }
  const filter: any = { entityId };
  if (recorded) {
    filter.recorded = {
      $gt: recorded
    };
  }
  return this.resolve(await collection.events.find(filter).sort({ recorded: 1 }).toArray());
};

/*
 |--------------------------------------------------------------------------------
 | Join
 |--------------------------------------------------------------------------------
 */

export const join: WsAction<{ entityId: string }> = async function (socket, { entityId }) {
  // const permission = socket.auth.access.get(streamId).can("join", "stream");
  // if (!permission.granted) {
  //   return this.reject("You are not authorized to join this stream");
  // }
  socket.join(`stream:${entityId}`);
  return this.resolve();
};

/*
 |--------------------------------------------------------------------------------
 | Leave
 |--------------------------------------------------------------------------------
 */

export const leave: WsAction<{ entityId: string }> = async function (socket, { entityId }) {
  socket.leave(`stream:${entityId}`);
  return this.resolve();
};
