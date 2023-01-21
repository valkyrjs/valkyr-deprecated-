import Pagination from "rc-pagination";

import { Link } from "~components/link.component";
import { Table } from "~components/table.component";

import { UsersController } from "./users.controller";

const limit = 50;

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

export const UsersView = UsersController.view(
  ({ state: { users, page }, actions: { addUsers, search, queryRange, queryOffset, exportUsers, goToPage } }) => {
    return (
      <div>
        <Pagination current={page} pageSize={limit} onChange={goToPage} total={users.length} />
        <input placeholder="Find user" onChange={search} />
        <button onClick={() => addUsers(10)}>Add User</button>
        <button onClick={() => queryRange("0aObG04jJEcffbFpAUR08", "18GXoBJB0yVEDg1ynJTIw")}>Query Range</button>
        <button onClick={() => queryOffset("15ykSozbZvEsd3r0onGaU", -1, 2)}>Query Offset</button>
        <button onClick={exportUsers}>Export</button>
        <div>
          Users | {users.length} | Total Posts {users.reduce((total, user) => total + user.posts, 0)}
        </div>
        <Table columns={columns} data={users.slice((page - 1) * limit, (page - 1) * limit + limit)} />
      </div>
    );
  }
);
