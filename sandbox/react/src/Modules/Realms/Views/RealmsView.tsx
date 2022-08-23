import { router } from "@App/Services/Router";
import { Fragment } from "react";

import { controller } from "../Controllers/RealmsController";

export const RealmsView = controller.view(
  ({ actions: { addRealm, toggle, clearRealms, filter, deleteRealm }, state: { realms } }) => {
    return (
      <div>
        {[1, 10, 50, 100].map((amount) => {
          return (
            <button
              onClick={() => {
                addRealm(amount);
              }}
            >
              Add {amount} Realm{amount > 1 ? "s" : ""}
            </button>
          );
        })}
        <button onClick={toggle}>Toggle Sort Direction</button>
        <button onClick={clearRealms}>Clear</button>
        <div>
          <input
            placeholder="Filter by name"
            onChange={({ target }) => {
              filter(target.value);
            }}
          />
        </div>
        {realms.map((realm) => {
          return (
            <Fragment key={realm.id}>
              <pre>{JSON.stringify(realm, null, 2)}</pre>

              <button
                onClick={() => {
                  deleteRealm(realm.id);
                }}
              >
                Delete
              </button>
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
  }
);
