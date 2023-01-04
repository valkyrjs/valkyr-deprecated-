import Pagination from "rc-pagination";

import { Table } from "~components/table.component";

import { PostsController } from "./posts.controller";

const columns = [
  {
    Header: "Posts",
    columns: [
      {
        Header: "Body",
        accessor: "body"
      },
      {
        Header: "Likes",
        accessor: "likes"
      },
      {
        Header: "Comments",
        accessor: "comments"
      },
      {
        Header: "Created By",
        accessor: "createdBy"
      },
      {
        Header: "Created At",
        accessor: "createdAt"
      }
    ]
  }
];

export const PostsView = PostsController.view(
  ({ props: { author }, state: { posts, page }, actions: { addPosts, indexExpression, goToPage } }) => {
    return (
      <div>
        <Pagination current={page} pageSize={10} onChange={goToPage} total={posts.length} />
        <button onClick={() => addPosts(10000)}>Add Posts</button>
        <button onClick={indexExpression}>Indexed Expression</button>
        <div>
          Posts | {author && `by author: ${author} | `} {posts.length}
        </div>
        <Table columns={columns} data={posts.slice((page - 1) * 10, (page - 1) * 10 + 10)} />
      </div>
    );
  },
  {
    memoize: false
  }
);
