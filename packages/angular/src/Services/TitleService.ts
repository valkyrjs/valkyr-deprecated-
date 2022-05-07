import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

type Title = [string, string?];

@Injectable({
  providedIn: "root"
})
export class TitleService {
  private observer = new Subject<Title>();
  private subscriber = this.observer.asObservable();

  public get subscribe() {
    return this.subscriber.subscribe.bind(this.subscriber);
  }

  public set(title: string, target?: string) {
    this.observer.next([title, target]);
  }
}
