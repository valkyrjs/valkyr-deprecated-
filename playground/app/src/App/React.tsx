import { createElement, ReactElement } from "react";

export function createReactError(err: any): ReactElement {
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

export function createReactElement(list: React.ComponentType[]): any {
  if (list.length === 1) {
    return createElement(list[0]);
  }
  return createElement(list[0], createReactElement(list.slice(1, list.length)));
}
