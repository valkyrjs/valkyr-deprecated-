import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

export const DOCUMENT_TITLE = "title:document";

@Injectable({
  providedIn: "root"
})
export class TitleService {
  private observer = new Subject<Title>();
  private subscriber = this.observer.asObservable();

  public get subscribe() {
    return this.subscriber.subscribe.bind(this.subscriber);
  }

  public set(title: string, ...targetValues: string[]) {
    const targets = new Targets(targetValues);
    if (targets.has(DOCUMENT_TITLE)) {
      globalThis.document.title = title;
    }
    this.observer.next(new Title(title, targets));
  }
}

class Title {
  constructor(public value: string, public targets: Targets) {}
}

class Targets {
  constructor(private targets: string[]) {}

  public has(target: string) {
    return this.targets.includes(target);
  }
}
