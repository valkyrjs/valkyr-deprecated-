import { router } from "@App/Services/Router";

import { controller } from "../Controllers/RealmController";

export const RealmView = controller.view(({ state: { realm } }) => {
  if (realm === undefined) {
    return <div>Realm not found!</div>;
  }
  return (
    <div>
      <button
        onClick={() => {
          router.goTo("/");
        }}
      >
        Back
      </button>
      <pre>{JSON.stringify(realm, null, 2)}</pre>
    </div>
  );
});
