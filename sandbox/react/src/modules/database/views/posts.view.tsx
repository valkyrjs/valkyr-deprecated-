import { Table } from "~components/table.component";

import { controller } from "./posts.controller";

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

export const PostsView = controller.view(
  ({ state: { posts }, actions: { addPosts } }) => {
    return (
      <div>
        <button onClick={() => addPosts(5000)}>Add Posts</button>
        <div>Posts | {posts.length}</div>
        <Table columns={columns} data={posts} />
      </div>
    );
  },
  {
    memoize: false
  }
);
