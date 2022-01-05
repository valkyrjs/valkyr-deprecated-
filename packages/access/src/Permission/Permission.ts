import { Attributes as BaseAttributes } from "../Attributes";
import type { Response } from "./Types";

export const PERMISSION_DENIED_MESSAGE = "Permission denied";

export class Permission<Attributes extends BaseAttributes = BaseAttributes> {
  public readonly granted: boolean;
  public readonly message: string = PERMISSION_DENIED_MESSAGE;

  public readonly attributes?: Attributes;

  constructor(response: Response<Attributes>) {
    this.granted = response.granted === true;
    if (response.granted === true && response.attributes) {
      this.attributes = response.attributes;
    }
    if (response.granted === false && response.message) {
      this.message = response.message;
    }
  }

  public filter<Data extends Record<string, unknown>>(data: Data | Data[], filter = "$all") {
    if (!this.attributes) {
      return data;
    }
    if (Array.isArray(data)) {
      return data.map((data) => this.attributes!.filter(filter, data));
    }
    return this.attributes.filter(filter, data);
  }
}
