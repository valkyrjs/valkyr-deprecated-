import "./template.styles.scss";

import { createElement } from "react";

import { Icon } from "~components/icon.component";
import { Link } from "~components/link.component";

import { controller } from "./template.controller";

export const DatabaseTemplateView = controller.view(({ state: { routed } }) => {
  return (
    <div id="database-template">
      <div className="sidebar">
        <ul className="nav-top">
          <li>
            <Link href="/">
              <Icon name="image-album" /> Dashboard
            </Link>
          </li>
          <li>
            <Link href="/users">
              <Icon name="users" /> Users
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

/*
<button onClick={() => User.faker()}>Create User</button>
<button onClick={() => User.faker(500)}>Create 500 Users</button>
<div>Users | {users.length}</div>
<pre>{JSON.stringify(users, null, 2)}</pre>
*/
