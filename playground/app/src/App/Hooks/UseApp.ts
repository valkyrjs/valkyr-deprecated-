import { createElement, useEffect, useState } from "react";

import { app } from "../App";
import { createReactError } from "../Components/ReactError";

export function useApp() {
  const [view, setView] = useState<JSX.Element | null>(null);

  useEffect(() => {
    app.listen({
      onRender(components: React.ComponentType[]) {
        setView(createReactElement(components));
      },
      onError(err: any) {
        setView(createReactError(err));
      }
    });
  }, []);

  return view;
}

export function createReactElement(list: React.ComponentType[]): any {
  if (list.length === 1) {
    return createElement(list[0]);
  }
  return createElement(list[0], createReactElement(list.slice(1, list.length)));
}
