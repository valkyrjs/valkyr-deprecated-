import { hasData } from "../../Policies/hasData";
import { route } from "../../Providers/Server";
import { join, leave, message } from "./Channels.Controller";

route.on("channels.join", [hasData(["channelId"]), join]);
route.on("channels.message", [hasData(["channelId", "message"]), message]);
route.on("channels.leave", [hasData(["channelId"]), leave]);
