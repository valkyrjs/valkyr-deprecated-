import { FunctionComponent } from "react";

import { ControllerRefs } from "./controller.refs";

export type ControllerClass = {
  new (state: any, pushState: Function): any;
  make(component: ReactComponent<any, any>, pushState: Function): any;
};

export type ReactComponent<Props extends {}, Controller extends ControllerClass> = FunctionComponent<{
  props: Props;
  state: InstanceType<Controller>["state"];
  actions: Omit<InstanceType<Controller>, ReservedPropertyMembers>;
  refs: ControllerRefs;
  component?: React.FC;
}>;

export type ReservedPropertyMembers = "state" | "pushState" | "init" | "destroy" | "setNext" | "setState" | "toActions";
