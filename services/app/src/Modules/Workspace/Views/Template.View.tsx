import { createComponent } from "solid-js";

import { TemplateController } from "./Template.Controller";

export const TemplateView = TemplateController.view(({ state }) => {
  return (
    <main class="h-screen w-screen bg-slate-900 text-white">
      {state.routed !== undefined ? createComponent(state.routed.component, state.routed.props) : null}
    </main>
  );
});
