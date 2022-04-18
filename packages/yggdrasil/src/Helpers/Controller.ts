import { response } from "@valkyr/router";

export class YggdrasilController {
  public get reject() {
    return response.reject;
  }

  public get redirect() {
    return response.redirect;
  }

  public get render() {
    return response.render;
  }
}
