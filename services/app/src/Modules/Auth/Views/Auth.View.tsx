import { createComponent } from "solid-js";

import { AuthController } from "./Auth.Controller";

export const AuthView = AuthController.view(({ state }) => {
  return (
    <main class="h-screen w-screen bg-slate-900 text-white">
      {state.routed !== undefined ? createComponent(state.routed.component, state.routed.props) : null}
    </main>
  );
});
