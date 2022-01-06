import { route } from "../../Providers/Server";
import { meta, ping } from "./Controller";

route.get("", [meta]);
route.on("ping", [ping]);
