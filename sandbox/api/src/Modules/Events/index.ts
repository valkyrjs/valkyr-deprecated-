import { hasData } from "../../Policies/hasData";
import { route } from "../../Providers/Server";
import { add, get, rehydrate } from "./Events.Controller";

route.on("events.add", [hasData(["id", "streams", "event"]), add]);
route.on("events.get", [hasData(["stream"]), get]);
route.on("events.rehydrate", [rehydrate]);
