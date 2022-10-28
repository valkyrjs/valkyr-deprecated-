import { Link } from "~components/link.component";
import { Table } from "~components/table.component";

import { controller } from "./users.controller";

const columns = [
  {
    Header: "Users",
    columns: [
      {
        Header: "#",
        accessor: "id"
      },
      {
        Header: "Name",
        accessor: "name"
      },
      {
        Header: "Email",
        accessor: "email"
      },
      {
        Header: "Post Count",
        accessor: "posts",
        Cell: ({ row, value }) => {
          return (
            <div>
              <Link href={`/posts?author=${row.cells[0].value}`}>{value}</Link>
            </div>
          );
        }
      }
    ]
  }
];

export const UsersView = controller.view(({ state: { users }, actions: { addUsers } }) => {
  return (
    <div>
      <button onClick={() => addUsers(100)}>Add User</button>
      <div>
        Users | {users.length} | Total Posts {users.reduce((total, user) => total + user.posts, 0)}
      </div>
      <Table columns={columns} data={users} />
    </div>
  );
});
