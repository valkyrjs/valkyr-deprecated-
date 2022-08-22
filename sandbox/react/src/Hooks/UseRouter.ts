import { router } from "@App/Services/Router";
import React, { useEffect, useState } from "react";

/*
 |--------------------------------------------------------------------------------
 | Hook
 |--------------------------------------------------------------------------------
 */

export function useRouter(setup: onSetupFn, onError: OnErrorFn): JSX.Element | undefined {
  const [view, setView] = useState<JSX.Element | undefined>(undefined);

  useEffect(() => {
    const { pathname, search, state } = router.history.location;
    setup().then(() => {
      router
        .listen({
          render: async (components: React.ComponentType[]) => {
            setView(createReactElement(components));
          },
          error: (err: any) => {
            const component = onError(err);
            if (component) {
              setView(component);
            }
          }
        })
        .goTo(`${pathname}${search}`, state);
    });
  }, [onError]);

  return view;
}

/*
 |--------------------------------------------------------------------------------
 | Helpers
 |--------------------------------------------------------------------------------
 */

function createReactElement(list: React.ComponentType[]): any {
  if (list.length === 1) {
    return React.createElement(list[0], {});
  }
  return React.createElement(list[0], {}, createReactElement(list.slice(1, list.length)));
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type onSetupFn = () => Promise<void>;

type OnErrorFn = (err: any) => JSX.Element | undefined;
