import { router } from "@App/Services/Router";
import { view } from "@App/Services/View";

import { RealmController } from "../Controllers/RealmController";

export const RealmView = view(RealmController, ({ state, loading, error }) => {
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
          router.goTo("/");
        }}
      >
        Back
      </button>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
});
