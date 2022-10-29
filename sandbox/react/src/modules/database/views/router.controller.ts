import { Controller, ViewController } from "@valkyr/react";

class RouterController extends Controller<never, Props> {
  async onResolve() {
    console.log(this.props);
  }
}

export type Props = {
  foo?: string;
  x?: string;
};

export const controller = new ViewController(RouterController);
