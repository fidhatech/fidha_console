import { Button, Table, type Column, AudioPlayer } from "../../ui";

export type UserType = {
  id: number | string;
  name: string;
  phone?: string;
  role: string;
  isBlocked: boolean;
  submittedDate: string | Date;
  audio: string;
};

const columns = (
  onReject: (id: number | string) => void,
  onAccept: (id: number | string) => void
): Column<UserType>[] => [
  { key: "name", header: "Name" },
  {
    key: "phone",
    header: "Phone",
    render: (row) => row.phone || "-",
  },
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
    key: "submittedDate",
    header: "submitted",
  },
  {
    key: "audio",
    header: "Audio",
    render: (row) => <AudioPlayer src={row.audio} />,
  },
  {
    key: "id",
    header: "Action",
    render: (row) => (
      <div className="flex gap-2">
        <Button variant="action" onClick={() => onReject(row.id)}>
          Reject
        </Button>
        <Button variant="action" onClick={() => onAccept(row.id)}>
          Accept
        </Button>
      </div>
    ),
  },
];

type VerificationProps = {
  onReject: (id: number | string) => void;
  onAccept: (id: number | string) => void;
  data: UserType[] | undefined;
};

export default function Verification({
  onReject,
  onAccept,
  data,
}: VerificationProps) {
  return <Table columns={columns(onReject, onAccept)} data={data} />;
}
