import { Link } from "react-router";
import { Button, Table, type Column } from "../../ui";
import { type UserListType } from "../../types/user.type";

const columns = (onBlock: (user: UserListType) => void): Column<UserListType>[] => [
  { key: "name", header: "Name" },
  { key: "phone", header: "Phone" },
  {
    key: "role",
    header: "Role",
    render: (row) => (
      <p
        className={`px-2 py-1 rounded max-w-18 text-center text-blue-700 ${
          row.role === "Employee" ? "bg-blue-300" : "bg-blue-100"
        } text-xs`}
      >
        {row.role}
      </p>
    ),
  },
  {
    key: "dateOfJoin",
    header: "Date Of Join",
  },
  {
    key: "isBlocked",
    header: "Status",
    render: (row) => (
      <p
        className={`px-2 py-1 rounded max-w-15 text-center text-gray-500 ${
          row.isBlocked ? "bg-red-400" : "bg-green-400"
        } text-xs`}
      >
        {row.isBlocked ? "Blocked" : "Active"}
      </p>
    ),
  },
  {
    key: "id",
    header: "Action",
    render: (row) => (
      <div className="flex items-center gap-2">
        <Button variant="action" onClick={() => onBlock(row)}>
          {row.isBlocked ? "Unblock" : "Block"}
        </Button>
        <Link
          to={`/admin/user-management/${row.id}/wallet`}
          state={{ name: row.name || row.phone }}
          className="px-4 py-2 rounded-md font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
        >
          Wallet
        </Link>
      </div>
    ),
  },
];

type UserProps = {
  users: UserListType[] | undefined;
  onBlock: (user: UserListType) => void;
};

export default function User({ users, onBlock }: UserProps) {
  return <Table columns={columns(onBlock)} data={users} />;
}
