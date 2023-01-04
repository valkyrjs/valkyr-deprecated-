import "./layout.styles.scss";

import { createElement } from "react";

import { Sidebar } from "../components/sidebar.component";
import { LayoutController } from "./layout.controller";

export const LayoutView = LayoutController.view(({ state: { routed } }) => {
  return (
    <div id="database-template">
      <Sidebar />
      <div className="content">{routed !== undefined ? createElement(routed.component, routed.props) : null}</div>
    </div>
  );
});
