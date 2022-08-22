export abstract class ViewController<Controller extends ControllerClass> {
  constructor(readonly controller: Controller) {}

  abstract component(...args: any[]): any;
}

export type ControllerClass = {
  state: any;
  new (pushState: Function): any;
  make(pushState: Function): any;
};
