import React, { memo, useEffect, useState } from "react";

import { ControllerClass, ViewController } from "./ViewController";

/**
 * Creates a model view controller layer that can wrap around functional react
 * components and provides managed state from the applied controller.
 */
export class ReactViewController<Controller extends ControllerClass> extends ViewController<Controller> {
  static #options: ViewOptions<any> = {
    loading() {
      return <div>Loading</div>;
    },
    error({ error }) {
      return <div>{error.message}</div>;
    },
    memoize: true
  };

  static set loading(component: React.FC) {
    this.#options.loading = component;
  }

  static set error(component: React.FC) {
    this.#options.error = component;
  }

  static set memo(enable: boolean) {
    this.#options.memoize = enable;
  }

  /**
   * Register a function react component to be controller by the controller
   * registered on the instance.
   *
   * @param component - Functional react component.
   */
  view<Props extends {}>(
    component: ReactComponent<Props, Controller>,
    options: ViewOptions<Props> = {
      loading: ReactViewController.#options.loading,
      error: ReactViewController.#options.error,
      memoize: ReactViewController.#options.memoize
    }
  ) {
    const wrapper: React.FC<Props> = (props) => {
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
        return options.loading(props);
      }

      if (error !== undefined) {
        return options.error({ ...props, error });
      }

      return component({ props, state, actions });
    };

    // ### Memoize
    // By default run component through react memoization using stringify
    // matching to determine changes to props.

    if (options.memoize === true) {
      return memo(wrapper, (prev, next) => {
        return JSON.stringify(prev) === JSON.stringify(next);
      });
    }

    return wrapper;
  }
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
}>;

type ViewOptions<Props> = {
  loading: React.FC<Props>;
  error: React.FC<Props & { error: Error }>;
  memoize: boolean;
};

type ReservedPropertyMembers = "state" | "pushState" | "init" | "destroy" | "setNext" | "setState" | "toActions";
