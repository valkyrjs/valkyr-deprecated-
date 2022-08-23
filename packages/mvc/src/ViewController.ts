export abstract class ViewController<Controller extends ControllerClass> {
  constructor(readonly controller: Controller) {}

  abstract view(...args: any[]): any;
}

export type ControllerClass = {
  state: any;
  new (state: any, pushState: Function): any;
  make(pushState: Function): any;
};
