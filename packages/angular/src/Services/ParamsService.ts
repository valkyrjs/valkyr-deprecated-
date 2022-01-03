import { Injectable } from "@angular/core";
import { ParamMap } from "@angular/router";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ParamsService {
  private observer = new Subject<ParamMap>();
  private subscriber = this.observer.asObservable();

  public get subscribe() {
    return this.subscriber.subscribe.bind(this.subscriber);
  }

  public next(params: ParamMap) {
    this.observer.next(params);
  }
}
