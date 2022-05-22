import { Injectable } from "@angular/core";
import { ParamMap } from "@angular/router";

import { SubscriberService } from "../Helpers/SubscriberService";

@Injectable({
  providedIn: "root"
})
export class ParamsService extends SubscriberService<ParamMap> {
  next(params: ParamMap) {
    this.observer.next(params);
  }
}
