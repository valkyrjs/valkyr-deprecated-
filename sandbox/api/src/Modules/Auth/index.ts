import { hasData } from "../../Policies/hasData";
import { isSocketAuthenticated } from "../../Policies/isAuthenticated";
import { route } from "../../Providers/Server";
import { create, destroy, login, permissions, resolve } from "./Auth.Controller";

route.on("auth:token", [hasData(["email"]), create]);
route.on("auth:login", [hasData(["email", "token"]), login]);
route.on("auth:resolve", [hasData(["token"]), resolve]);
route.on("auth:permissions", [isSocketAuthenticated, hasData(["tenantId"]), permissions]);
route.on("auth:destroy", [destroy]);
