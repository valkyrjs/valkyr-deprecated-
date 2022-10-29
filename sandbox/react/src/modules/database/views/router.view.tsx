import { Link } from "~components/link.component";

import { controller, Props } from "./router.controller";

export const RouterView = controller.view<Props>(({ props }) => {
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
