import { Route } from "@valkyr/router";

import { render } from "~middleware/render";

import { SampleFormView } from "./views/sample-form.view";

export const routes = [
  new Route({
    name: "Form",
    path: "/form",
    actions: [render(SampleFormView)]
  })
];
