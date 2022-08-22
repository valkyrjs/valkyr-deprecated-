import React, { useEffect, useState } from "react";

import { ControllerClass, ViewController } from "./ViewController";

/**
 * Creates a model view controller layer that can wrap around functional react
 * components and provides managed state from the applied controller.
 */
export class ReactViewController<Controller extends ControllerClass> extends ViewController<Controller> {
  /**
   * Register a function react component to be controller by the controller
   * registered on the instance.
   *
   * @param component - Functional react component.
   */
  component<Props extends {}>(component: ReactComponent<Props, Controller>) {
    const wrapper: React.FC<Props> = (props) => {
      const [controller, setController] = useState<InstanceType<Controller>>();
      const [state, setState] = useState(this.controller.state);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<Error | undefined>();

      useEffect(() => {
        let isMounted = true;

        const controller = this.controller.make(setState);

        setController(controller);

        controller
          .init()
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
          controller.destroy();
        };
      }, []);

      return component({ ...props, ...state, controller, loading, error });
    };
    return wrapper;
  }
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type ReactComponent<Props extends {}, Controller extends ControllerClass> = React.FC<
  Props &
    InstanceType<Controller>["state"] & {
      controller: InstanceType<Controller>;
      loading: boolean;
      error: Error | undefined;
    }
>;
