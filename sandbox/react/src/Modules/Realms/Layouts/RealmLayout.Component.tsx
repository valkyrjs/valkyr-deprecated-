import { router } from "@App/Services/Router";
import { createElement } from "react";

import { controller } from "./RealmLayout.Controller";

export const RealmLayout = controller.view(({ state: { routed }, actions: { goTo } }) => {
  return (
    <div>
      <div>
        <button onClick={router.back}>Router Back</button>
        <button onClick={goTo("")}>Home</button>
        <button onClick={goTo("members")}>Members</button>
        <button onClick={goTo("pages")}>Pages</button>
        <button onClick={goTo("invites")}>Invites</button>
        <button onClick={router.forward}>Router Forward</button>
      </div>
      <div>{routed ? createElement(routed.component, routed.props) : null}</div>
    </div>
  );
});
