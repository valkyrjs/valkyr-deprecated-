import { Application, Module } from "@valkyr/yggdrasil";
import { createContext, createElement, ReactElement, useContext, useState } from "react";

import { AuthModule } from "./Auth/Module";
import { WorkspaceModule } from "./Workspace/Module";

/*
 |--------------------------------------------------------------------------------
 | App Module
 |--------------------------------------------------------------------------------
 */

@Module({
  imports: [AuthModule, WorkspaceModule]
})
class RootModule {}

/*
 |--------------------------------------------------------------------------------
 | App
 |--------------------------------------------------------------------------------
 */

export const app = new Application(RootModule, {
  onRender(components: React.ComponentType[]) {
    return createReactElement(components);
  },
  onError(err: any) {
    return createReactError(err);
  }
});

/*
 |--------------------------------------------------------------------------------
 | Context
 |--------------------------------------------------------------------------------
 */

export const AppContext = createContext(app);

/*
 |--------------------------------------------------------------------------------
 | App Hooks
 |--------------------------------------------------------------------------------
 */

export function useApp(app: Application) {
  const [view, setView] = useState<JSX.Element | null>(null);

  app.on("render", setView);
  app.on("error", setView);

  return view;
}

export function useRouter() {
  return useContext(AppContext).router;
}

export function useProvider<T extends { new (): any } = any>(value: T): InstanceType<T> {
  return useContext(AppContext).get(value);
}

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

function createReactError(err: any): ReactElement {
  return (
    <div className="flex h-screen">
      <div className="m-auto">
        {err.message ? (
          <pre>
            {err.message}
            <br />
            {err.stack}
          </pre>
        ) : (
          <code>{JSON.stringify(err, null, 2)}</code>
        )}
      </div>
    </div>
  );
}

function createReactElement(
  list: React.ComponentType[],
  props = { ...app.router.params.get(), ...app.router.query.get() }
): any {
  if (list.length === 1) {
    return createElement(list[0], props);
  }
  return createElement(list[0], props, createReactElement(list.slice(1, list.length), props));
}
