import { Inject, Injectable } from "@angular/core";
import { DataSubscriberService, StreamService } from "@valkyr/angular";

import { Template, TemplateModel } from "../Models/Template";

@Injectable({ providedIn: "root" })
export class TemplateSubscriberService extends DataSubscriberService<TemplateModel> {
  constructor(@Inject(Template) readonly model: TemplateModel, readonly stream: StreamService) {
    super();
  }
}
