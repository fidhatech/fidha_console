import { Button, Table, type Column } from "../../ui";
import { type UserListType } from "../../types/user.type";

const columns = (onBlock: (id: string) => void): Column<UserListType>[] => [
  { key: "name", header: "Name" },
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
      <Button variant="action" onClick={() => onBlock(row.id)}>
        {row.isBlocked ? "Unblock" : "Block"}
      </Button>
    ),
  },
];

type UserProps = {
  users: UserListType[] | undefined;
  onBlock: (id: string) => void;
};

export default function User({ users, onBlock }: UserProps) {
  return <Table columns={columns(onBlock)} data={users} />;
}
