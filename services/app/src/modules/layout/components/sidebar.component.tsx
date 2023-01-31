import { Icon } from "~components/icon.component";
import { Link } from "~components/link.component";

export function Sidebar() {
  return (
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
          <Link href="/multi">
            <Icon name="models" /> Multi
          </Link>
        </li>
        <li>
          <Link href="/tests">
            <Icon name="console" /> Tests
          </Link>
        </li>
        <li>
          <Link href="/performance">
            <Icon name="console" /> Performance
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
          <Link href="/queue">
            <Icon name="models" /> Queue
          </Link>
        </li>
      </ul>
    </div>
  );
}
