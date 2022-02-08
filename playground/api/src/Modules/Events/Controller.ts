import { publisher } from "@valkyr/ledger";
import { WsAction } from "@valkyr/server";
import { Event } from "stores";

import { collection } from "../../Collections";

export const add: WsAction<Event> = async function (socket, event) {
  // const permission = socket.auth.access.get(descriptor.stream).can("add", descriptor.event.type);
  // if (!permission.granted) {
  //   return this.reject("You are not authorized to add this event to the stream");
  // }
  try {
    // await store.insert(event);
    socket.to(`stream:${event.streamId}`).emit("event", event);
    return this.resolve();
  } catch (error) {
    return this.reject(400, error.message);
  }
};

export const get: WsAction<{ stream: string; hash?: string }> = async function (_, { stream, hash }) {
  // const permission = socket.auth.access.get(stream).can("get", "events");
  // if (!permission.granted) {
  //   return this.reject("You are not authorized to get events on this stream");
  // }
  const filter: any = { "data.id": stream };
  if (hash) {
    filter["hash.commit"] = {
      $gt: hash
    };
  }
  return this.resolve(await collection.events.find(filter).sort({ "meta.timestamp": 1 }).toArray());
};

export const rehydrate: WsAction = async function () {
  console.log("Starting re-hydration process!");
  await Promise.all(
    Object.keys(collection).map((key) => {
      if (key !== "events") {
        return (collection[key as keyof typeof collection] as any).deleteMany({});
      }
      return new Promise<void>((resolve) => resolve());
    })
  );
  const events = await collection.events.find({}, { sort: { date: 1 } }).toArray();
  for (const event of events) {
    await publisher.project(event, { outdated: false, hydrated: true });
  }
  console.log("Hydration ended successfully");
  return this.resolve();
};
