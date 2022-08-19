import { useEffect, useState } from "react";

/*
 |--------------------------------------------------------------------------------
 | React View
 |--------------------------------------------------------------------------------
 |
 | A wrapper method ensuring controller, loading and error state occurring within
 | the assigned controller is properly propagated through the react component.
 |
 */

type ComponentClass = {
  state: any;
  new (pushState: Function): any;
  make(pushState: Function): any;
};

export function view<
  C extends ComponentClass,
  Element extends React.FC<{
    controller: InstanceType<C>;
    state: InstanceType<C>["state"];
    loading: boolean;
    error: Error | undefined;
  }>
>(ViewController: C, component: Element) {
  const wrapper: React.FC = () => {
    const [controller, setController] = useState<InstanceType<C>>();
    const [state, setState] = useState(ViewController.state);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | undefined>();

    useEffect(() => {
      let isMounted = true;

      const controller = ViewController.make(setState);

      setController(controller);

      controller
        .init()
        .catch((err) => {
          if (isMounted === true) {
            setError(err);
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

    return component({ controller, state, loading, error });
  };
  return wrapper;
}
