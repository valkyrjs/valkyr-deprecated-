import { faker } from "@faker-js/faker";
import { useState } from "react";

import { RealmsList } from "../Components/RealmsList.Component";

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
