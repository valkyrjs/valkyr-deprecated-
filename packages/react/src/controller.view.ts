import { deepEqual } from "fast-equals";
import React, { createElement, FunctionComponent, memo, PropsWithChildren, useEffect, useState } from "react";

import type { ControllerClass, ReactComponent } from "./controller.types";

/*
 |--------------------------------------------------------------------------------
 | Options
 |--------------------------------------------------------------------------------
 */

const options: Partial<ViewOptions<any>> = {
  memoize: defaultMemoizeHandler
};

/*
 |--------------------------------------------------------------------------------
 | Factory
 |--------------------------------------------------------------------------------
 */

export function makeControllerView<Controller extends ControllerClass>(controller: Controller) {
  return function view<Props extends {}>(
    component: ReactComponent<Props, Controller>,
    options?: Partial<ViewOptions<Props>>
  ): FunctionComponent<Props> {
    const memoize = getMemoizeHandler(options?.memoize);
    const render = {
      loading: getLoadingComponent(options),
      error: getErrorComponent(options)
    };

    const container: FunctionComponent<PropsWithChildren<Props>> = (props) => {
      const { error, view } = useView(controller, component, props);
      if (view === undefined) {
        return render.loading(props);
      }
      if (error !== undefined) {
        return render.error({ ...props, error });
      }
      return view;
    };

    container.displayName = component.displayName = options?.name ?? `${controller.name}View`;

    // ### Memoize
    // By default run component through react memoization using stringify
    // matching to determine changes to props.

    if (memoize !== false) {
      return memo(container, memoize);
    }

    return container;
  };
}

/*
 |--------------------------------------------------------------------------------
 | Hooks
 |--------------------------------------------------------------------------------
 */

function useView(instance: InstanceType<ControllerClass> | undefined, component: React.FC, props: any) {
  const [view, setView] = useState();

  const error = useController(instance, component, props, setView);

  return { error, view };
}

function useController(controller: ControllerClass, component: any, props: any, setView: any) {
  const [instance, setInstance] = useState<InstanceType<ControllerClass> | undefined>(undefined);
  const error = useProps(instance, props);

  useEffect(() => {
    const instance = controller.make(component, setView);
    setInstance(instance);
    return () => {
      instance.$destroy();
    };
  }, []);

  return error;
}

function useProps(controller: InstanceType<ControllerClass> | undefined, props: any) {
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    if (controller === undefined) {
      return;
    }
    let isMounted = true;
    controller.$resolve(props).catch((error: Error) => {
      if (isMounted === true) {
        setError(error);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [controller, props]);

  return error;
}

/*
 |--------------------------------------------------------------------------------
 | Components
 |--------------------------------------------------------------------------------
 */

export function setLoadingComponent(component: React.FC) {
  options.loading = component;
}

function getLoadingComponent({ loading }: Partial<ViewOptions<any>> = {}) {
  const component = loading ?? options.loading;
  if (component === undefined) {
    return () => null;
  }
  return (props) => createElement(component, props);
}

export function setErrorComponent(component: React.FC) {
  options.error = component;
}

function getErrorComponent({ error }: Partial<ViewOptions<any>> = {}) {
  const component = error ?? options.loading;
  if (component === undefined) {
    return () => null;
  }
  return (props) => createElement(component, props);
}

/*
 |--------------------------------------------------------------------------------
 | Memoize
 |--------------------------------------------------------------------------------
 */

export function setMemoizeHandler(value: boolean | Memoize<any>) {
  if (typeof value === "function") {
    options.memoize = value;
  } else if (value === false) {
    options.memoize = false;
  } else {
    options.memoize = defaultMemoizeHandler;
  }
}

function getMemoizeHandler(memoize?: ViewOptions<any>["memoize"]): false | Memoize<any> {
  if (typeof memoize === "function") {
    return memoize;
  }
  if (memoize !== false) {
    return options.memoize;
  }
  return false;
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
  return deepEqual(prev, next);
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type ViewOptions<Props> = {
  name?: string;
  loading: React.FC<Props>;
  error: React.FC<Props & { error: Error }>;
  memoize: false | Memoize<Props>;
};

type Memoize<Props> = (prevProps: Readonly<Props>, nextProps: Readonly<Props>) => boolean;

type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
