import { Link } from "~components/link.component";

import { RouterController } from "./router.controller";

export const RouterView = RouterController.view(({ props }) => {
  return (
    <div>
      Router Query <pre>{JSON.stringify(props, null, 2)}</pre>
      <ul>
        <li>
          <Link href="/router">root</Link>
        </li>
        <li>
          <Link href="/router?foo=bar">q=foo:bar</Link>
        </li>
        <li>
          <Link href="/router?x=z">q=x:z</Link>
        </li>
      </ul>
    </div>
  );
});
