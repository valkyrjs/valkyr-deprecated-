/* @refresh reload */

import "./Modules";

import { controllers } from "@valkyr/solid";
import { createComponent } from "solid-js";
import { render } from "solid-js/web";

import { ControllerLoader } from "~Components/ControllerLoader.Component";
import { router } from "~Services/Router";

let currentComponent: () => void | undefined;

router
  .render((component, props = {}) => {
    currentComponent?.();
    if (component !== currentComponent) {
      currentComponent = render(() => createComponent(component, props), document.body);
    }
  })
  .error((error) => {
    console.error(error);
  })
  .listen();

controllers.loading = ControllerLoader;
