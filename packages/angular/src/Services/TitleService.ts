import { Injectable } from "@angular/core";

import { SubscriberService } from "../Helpers/SubscriberService";

export const DOCUMENT_TITLE = "title:document";

@Injectable({ providedIn: "root" })
export class TitleService extends SubscriberService<Title> {
  set(title: string, ...targetValues: string[]) {
    const targets = new Targets(targetValues);
    if (targets.has(DOCUMENT_TITLE)) {
      globalThis.document.title = title;
    }
    this.observer.next(new Title(title, targets));
  }
}

class Title {
  constructor(readonly value: string, readonly targets: Targets) {}
}

class Targets {
  readonly #targets: string[];

  constructor(targets: string[]) {
    this.#targets = targets;
  }

  has(target: string): boolean {
    return this.#targets.includes(target);
  }
}
