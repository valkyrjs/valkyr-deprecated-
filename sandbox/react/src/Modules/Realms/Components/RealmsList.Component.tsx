import { router } from "@App/Services/Router";
import { Fragment } from "react";

import { CreateRealm } from "./CreateRealm.Component";
import { controller, Props } from "./RealmsList.Controller";

export const RealmsList = controller.view<Props>(
  ({ props: { name }, state: { realms }, actions: { addRealm, toggle, clearRealms, filter, deleteRealm } }) => {
    return (
      <div>
        <CreateRealm />
        <div>Realms List Name: {name}</div>
        <div style={{ margin: "10px 0" }}>---</div>
        {[1, 10, 50, 100].map((amount) => {
          return (
            <button
              key={amount}
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
        {realms.length === 0 ? (
          <div>No realms found, create a new realm to get started</div>
        ) : (
          realms.map((realm) => {
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
                    router.goTo(`/realms/${realm.id}`);
                  }}
                >
                  Go
                </button>
              </Fragment>
            );
          })
        )}
      </div>
    );
  }
);