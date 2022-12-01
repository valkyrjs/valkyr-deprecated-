import { Controller, ViewController } from "@valkyr/react";

class RouterController extends Controller<never, Props> {}

export type Props = {
  foo?: string;
  x?: string;
};

export const controller = new ViewController(RouterController);
