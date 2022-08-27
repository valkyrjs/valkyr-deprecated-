import { router } from "@App/Services/Router";
import { Controller, ReactViewController } from "@valkyr/mvc";
import { createElement, ReactNode } from "react";

import { Invites } from "../Components/Invites";
import { Members } from "../Components/Members";
import { Pages } from "../Components/Pages";
import { RealmView } from "../Views/RealmView";

const content = {
  Members: Members,
  Pages: Pages,
  Invites: Invites
};

export class RealmLayoutController extends Controller<State> {
  async resolve(): Promise<void> {
    this.#subscribeToRoutes();
    this.render(router.route.name);
  }

  #subscribeToRoutes() {
    this.subscriptions.route?.unsubscribe();
    this.subscriptions.router = router.subscribe(
      ["/realms/:realms", "/realms/:realm/members", "/realms/:realm/pages", "/realms/:realm/invites"],
      ({ route }) => {
        this.render(route.name);
      }
    );
  }

  goToHome(): void {
    this.#goTo("");
  }

  goToMembers(): void {
    this.#goTo("/members");
  }

  goToPages(): void {
    this.#goTo("/pages");
  }

  goToInvites(): void {
    this.#goTo("/invites");
  }

  render(name: string): void {
    this.setState("content", createElement(content[name] ?? RealmView, {}));
  }

  #goTo(path: string): void {
    router.goTo(`/realms/${router.params.get("realm")}${path}`, {
      render: false
    });
  }
}

type State = {
  content: ReactNode;
};

export const controller = new ReactViewController(RealmLayoutController);
