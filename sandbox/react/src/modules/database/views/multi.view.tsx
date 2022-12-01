import { Fragment } from "react";

import { PostsView } from "./posts.view";
import { UsersView } from "./users.view";

export function MultiView() {
  return (
    <Fragment>
      <UsersView />
      <PostsView />
    </Fragment>
  );
}
