import { route } from "../../Providers/Server";
import { meta, ping } from "./Api.Controller";

route.get("", [meta]);
route.on("ping", [ping]);
