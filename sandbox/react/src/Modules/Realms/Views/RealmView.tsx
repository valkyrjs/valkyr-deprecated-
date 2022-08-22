import { router } from "@App/Services/Router";

import { view } from "../Controllers/RealmController";

export const RealmView = view.component(({ realm, loading, error }) => {
  if (loading === true) {
    return <div>Loading bro</div>;
  }

  if (error !== undefined) {
    return <div>{error.message}</div>;
  }

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
