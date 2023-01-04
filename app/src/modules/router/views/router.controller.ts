import { Controller } from "@valkyr/react";

export class RouterController extends Controller<never, Props> {}

export type Props = {
  foo?: string;
  x?: string;
};
