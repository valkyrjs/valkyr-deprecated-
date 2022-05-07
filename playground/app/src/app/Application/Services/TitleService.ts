import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class TitleService {
  private observer = new Subject<string>();
  private subscriber = this.observer.asObservable();

  public get subscribe() {
    return this.subscriber.subscribe.bind(this.subscriber);
  }

  public set(title: string) {
    this.observer.next(title);
  }
}
