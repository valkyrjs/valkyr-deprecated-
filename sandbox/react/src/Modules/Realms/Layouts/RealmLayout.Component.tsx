import { createElement } from "react";

import { InvitesView, MembersView, PagesView, RealmView } from "../Views/Realm";
import { controller } from "./RealmLayout.Controller";

const views = {
  Realm: RealmView,
  Members: MembersView,
  Pages: PagesView,
  Invites: InvitesView
};

export const RealmLayout = controller.view(({ state: { component }, actions: { goTo } }) => {
  return (
    <div>
      <div>
        <button onClick={goTo("")}>Home</button>
        <button onClick={goTo("members")}>Members</button>
        <button onClick={goTo("pages")}>Pages</button>
        <button onClick={goTo("invites")}>Invites</button>
      </div>
      <div>{views[component] ? createElement(views[component]) : null}</div>
    </div>
  );
});
