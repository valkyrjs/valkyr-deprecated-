import { JSX } from "solid-js/jsx-runtime";

export type ControllerClass = {
  new (state: any, pushState: Function): any;
};

export type ReservedPropertyMembers = "state" | "pushState" | "init" | "destroy" | "setNext" | "setState" | "toActions";

export type ControllerComponent<Props extends {}, Controller extends ControllerClass> = FunctionComponent<{
  props: Props;
  state: InstanceType<Controller>["state"];
  actions: Omit<InstanceType<Controller>, ReservedPropertyMembers>;
  component?: () => JSX.Element;
  watch: InstanceType<Controller>["watch"];
}>;

type FunctionComponent<Props> = (props: Props) => JSX.Element;
