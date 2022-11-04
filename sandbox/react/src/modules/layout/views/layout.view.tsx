import "./layout.styles.scss";

import { createElement } from "react";

import { Icon } from "~components/icon.component";
import { Link } from "~components/link.component";

import { controller } from "./layout.controller";

export const LayoutView = controller.view(({ state: { routed } }) => {
  return (
    <div id="database-template">
      <div className="sidebar">
        <ul className="nav-top">
          <li>
            <Link href="/">
              <Icon name="image-album" /> Dashboard
            </Link>
          </li>
          <li className="separator" />
          <li>
            <Link href="/users">
              <Icon name="users" /> Users
            </Link>
          </li>
          <li>
            <Link href="/posts">
              <Icon name="twitter" /> Posts
            </Link>
          </li>
          <li>
            <Link href="/tests">
              <Icon name="console" /> Tests
            </Link>
          </li>
          <li className="separator" />
          <li>
            <Link href="/router">
              <Icon name="console" /> Router
            </Link>
            <Link href="/form">
              <Icon name="clipboard-copy" /> Form
            </Link>
          </li>
        </ul>
      </div>
      <div className="content">{routed !== undefined ? createElement(routed.component, routed.props) : null}</div>
    </div>
  );
});
