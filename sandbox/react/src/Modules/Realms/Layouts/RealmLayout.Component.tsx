import { createElement } from "react";

import { controller } from "./RealmLayout.Controller";

export const RealmLayout = controller.view(({ state: { routed }, actions: { goTo } }) => {
  return (
    <div>
      <div>
        <button onClick={goTo("")}>Home</button>
        <button onClick={goTo("members")}>Members</button>
        <button onClick={goTo("pages")}>Pages</button>
        <button onClick={goTo("invites")}>Invites</button>
      </div>
      <div>{routed ? createElement(routed.component, routed.props) : null}</div>
    </div>
  );
});
