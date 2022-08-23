import { router } from "@App/Services/Router";
import { faker } from "@faker-js/faker";
import { Fragment, useState } from "react";

import { controller } from "../Controllers/RealmsController";

export const RealmsView = () => {
  const [outerName, setOuterName] = useState(faker.name.fullName());
  const [innerName, setInnerName] = useState(faker.name.fullName());
  return (
    <div>
      <div>Realms List</div>
      <div style={{ margin: "10px 0" }}>---</div>
      <button
        onClick={() => {
          setOuterName(faker.name.fullName());
        }}
      >
        Random Realms View Name
      </button>
      <pre>The realms view name change should not cause a re-render to be triggered in the RealmsList component.</pre>
      <div>Realms View Name: {outerName}</div>
      <div style={{ margin: "10px 0" }}>---</div>
      <button
        onClick={() => {
          setInnerName(faker.name.fullName());
        }}
      >
        Random Realms List Name
      </button>
      <pre>The realms list name change should cause a re-render to be triggered in the RealmsList component.</pre>
      <RealmsList name={innerName} />
    </div>
  );
};

export const RealmsList = controller.view<{ name: string }>(
  ({ props: { name }, state: { realms }, actions: { addRealm, toggle, clearRealms, filter, deleteRealm } }) => {
    console.log("Render > RealmsList");
    return (
      <div>
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
