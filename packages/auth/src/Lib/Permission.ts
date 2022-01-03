import { Attributes as BaseAttributes } from "./Attributes";

/*
 |--------------------------------------------------------------------------------
 | Constants
 |--------------------------------------------------------------------------------
 */

export const PERMISSION_DENIED_MESSAGE = "Permission denied";

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type Response<Attributes extends BaseAttributes = BaseAttributes> = Granted<Attributes> | Denied;

type Granted<Attributes extends BaseAttributes> = {
  granted: true;
  attributes?: Attributes;
};

type Denied = {
  granted: false;
  message?: string;
};

/*
 |--------------------------------------------------------------------------------
 | Permission
 |--------------------------------------------------------------------------------
 */

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
