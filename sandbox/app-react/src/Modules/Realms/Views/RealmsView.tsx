import { router } from "@App/Services/Router";
import { view } from "@App/Services/View";
import { Fragment } from "react";

import { RealmsController } from "../Controllers/RealmsController";

export const RealmsView = view(RealmsController, ({ controller, state, loading, error }) => {
  console.log("Render > RealmsComponent");

  if (loading === true) {
    return <div>Loading bro</div>;
  }

  if (error !== undefined) {
    return <div>{error.message}</div>;
  }

  return (
    <div>
      <button
        onClick={() => {
          controller.addRealm();
        }}
      >
        Action
      </button>
      <button
        onClick={() => {
          controller.clearRealms();
        }}
      >
        Clear
      </button>
      {state.realms.map((realm) => {
        return (
          <Fragment key={realm.id}>
            <pre>{JSON.stringify(realm, null, 2)}</pre>
            <button
              onClick={() => {
                router.goTo(realm.id);
              }}
            >
              Go
            </button>
          </Fragment>
        );
      })}
    </div>
  );
});
