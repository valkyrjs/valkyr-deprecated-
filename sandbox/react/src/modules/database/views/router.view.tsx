import { Link } from "~components/link.component";
import { router } from "~services/router";

export const RouterView = () => {
  return (
    <div>
      Router Query <pre>{JSON.stringify(router.query.get(), null, 2)}</pre>
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
};
