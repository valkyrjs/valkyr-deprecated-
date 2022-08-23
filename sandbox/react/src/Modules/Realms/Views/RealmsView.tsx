import { router } from "@App/Services/Router";
import { Fragment } from "react";

import { view } from "../Controllers/RealmsController";

export const RealmsView = view.component(({ controller, realms }) => {
  return (
    <div>
      <button
        onClick={() => {
          controller.addRealm();
        }}
      >
        Add Realm
      </button>
      {[10, 50, 100].map((amount) => {
        return (
          <button
            onClick={() => {
              controller.addRealm(amount);
            }}
          >
            Add {amount} Realms
          </button>
        );
      })}
      <button
        onClick={() => {
          controller.toggle();
        }}
      >
        Toggle Sort Direction
      </button>
      <button
        onClick={() => {
          controller.clearRealms();
        }}
      >
        Clear
      </button>
      <div>
        <input
          placeholder="Filter by name"
          onChange={({ target }) => {
            controller.filter(target.value);
          }}
        />
      </div>
      {realms.map((realm) => {
        return (
          <Fragment key={realm.id}>
            <pre>{JSON.stringify(realm, null, 2)}</pre>

            <button
              onClick={() => {
                controller.deleteRealm(realm.id);
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
});
