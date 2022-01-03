import { container } from "../Container";

export class Auth {
  public readonly token: string;
  public readonly data: any;

  constructor(token: string, data: any) {
    this.token = token;
    this.data = data;
  }

  /*
   |--------------------------------------------------------------------------------
   | Factories
   |--------------------------------------------------------------------------------
   */

  public static async resolve(value: string, token = container.get("Token")): Promise<Auth> {
    return new Auth(value, await token.decode(value));
  }

  public static guest(): Auth {
    return new Auth("guest", { auditor: "guest" });
  }

  /*
   |--------------------------------------------------------------------------------
   | Accessors
   |--------------------------------------------------------------------------------
   */

  public get isAuthenticated() {
    return this.data.auditor !== "guest";
  }

  public get auditor(): string {
    return this.data.auditor;
  }
}
