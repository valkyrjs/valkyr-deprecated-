import React, { memo, PropsWithChildren, useEffect, useState } from "react";

import { Refs } from "./Refs";

export class ViewController<Controller extends ControllerClass> {
  static #options: ViewOptions<any> = {
    name: undefined,
    loading() {
      return <div>Loading</div>;
    },
    error({ error }) {
      return <div>{error.message}</div>;
    },
    memoize: defaultMemoizeHandler
  };

  constructor(readonly controller: Controller) {}

  static set loading(component: React.FC) {
    this.#options.loading = component;
  }

  static set error(component: React.FC) {
    this.#options.error = component;
  }

  static set memo(value: boolean | Memoize<any>) {
    if (typeof value === "function") {
      this.#options.memoize = value;
    } else if (value === false) {
      this.#options.memoize = false;
    } else {
      this.#options.memoize = defaultMemoizeHandler;
    }
  }

  /**
   * Register a function react component to be controller by the controller
   * registered on the instance.
   *
   * @param component - Functional react component.
   */
  view<Props extends {}>(component: ReactComponent<Props, Controller>, options?: Partial<ViewOptions<Props>>) {
    const renderLoading = options?.loading ?? ViewController.#options.loading;
    const renderError = options?.error ?? ViewController.#options.error;
    const memoize = this.#getMemoize(options?.memoize);

    const wrapper: React.FC<PropsWithChildren<Props>> = (props) => {
      const [controller, setController] = useState<InstanceType<Controller> | undefined>(undefined);
      const [actions, setActions] = useState<any | undefined>();
      const [state, setState] = useState(this.controller.state);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<Error | undefined>();

      useEffect(() => {
        const controller = this.controller.make(setState);
        setController(controller);
        setActions(controller.toActions());
        return () => {
          controller.destroy();
        };
      }, []);

      useEffect(() => {
        let isMounted = true;

        if (controller === undefined) {
          return () => {
            isMounted = false;
          };
        }

        controller
          .resolve(props)
          .catch((error: Error) => {
            if (isMounted === true) {
              setError(error);
            }
          })
          .finally(() => {
            if (isMounted === true) {
              setLoading(false);
            }
          });

        return () => {
          isMounted = false;
        };
      }, [controller, props]);

      if (actions === undefined || loading === true) {
        return renderLoading(props);
      }

      if (error !== undefined) {
        return renderError({ ...props, error });
      }

      return component({ props, state, actions, refs: controller!.refs });
    };

    component.displayName = options?.name ?? component.name;
    wrapper.displayName = options?.name ?? component.name;

    // ### Memoize
    // By default run component through react memoization using stringify
    // matching to determine changes to props.

    if (memoize !== false) {
      return memo(wrapper, memoize);
    }

    return wrapper;
  }

  #getMemoize(memoize?: ViewOptions<any>["memoize"]): false | Memoize<any> {
    if (typeof memoize === "function") {
      return memoize;
    }
    if (memoize !== false) {
      return ViewController.#options.memoize;
    }
    return false;
  }
}

/*
 |--------------------------------------------------------------------------------
 | Defaults
 |--------------------------------------------------------------------------------
 */

function defaultMemoizeHandler(prev: any, next: any): boolean {
  if (prev.children !== undefined && next.children !== undefined) {
    if (prev.children.type.type.displayName !== next.children.type.type.displayName) {
      return false;
    }
  }
  return JSON.stringify(prev) === JSON.stringify(next);
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type ReactComponent<Props extends {}, Controller extends ControllerClass> = React.FC<{
  props: Props;
  state: InstanceType<Controller>["state"];
  actions: Omit<InstanceType<Controller>, ReservedPropertyMembers>;
  refs: Refs;
  component?: React.FC;
}>;

type ViewOptions<Props> = {
  name?: string;
  loading: React.FC<Props>;
  error: React.FC<Props & { error: Error }>;
  memoize: false | Memoize<Props>;
};

type ReservedPropertyMembers = "state" | "pushState" | "init" | "destroy" | "setNext" | "setState" | "toActions";

type Memoize<Props> = (prevProps: Readonly<Props>, nextProps: Readonly<Props>) => boolean;

type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type ControllerClass = {
  state: any;
  new (state: any, pushState: Function): any;
  make(pushState: Function): any;
};
