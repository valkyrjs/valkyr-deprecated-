import type { Type } from "@valkyr/client";
import { ConfigService } from "@valkyr/client/src/Services/Config";
import { useEffect, useState } from "react";

import { app } from "./App";
import { createReactElement, createReactError } from "./React";

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

export function useRouter() {
  return app.router;
}

export function useProvider<T extends Type>(value: T): InstanceType<T> {
  return app.get(value.name);
}

export function useConfig(path: string, defaultValue?: any) {
  return app.get(ConfigService).get(path, defaultValue);
}
