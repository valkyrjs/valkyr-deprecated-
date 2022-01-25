import { hasData } from "../../Policies/hasData";
import { route } from "../../Providers/Server";
import { join, leave, pull, push } from "./Controller";

// store.on("saved", (descriptor) => {
//   for (const stream of descriptor.streams) {
//     wss.to(`stream:${stream}`).emit("event", descriptor);
//   }
// });

route.on("streams.push", [hasData(["events"]), push]);
route.on("streams.pull", [hasData(["entityId"]), pull]);
route.on("streams.join", [hasData(["entityId"]), join]);
route.on("streams.leave", [hasData(["entityId"]), leave]);
