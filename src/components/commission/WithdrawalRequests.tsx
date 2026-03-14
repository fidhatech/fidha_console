import { Table, type Column } from "../../ui";
import type { WithdrawalRequestType } from "../../types/general.type";

const columns: Column<WithdrawalRequestType>[] = [
  { key: "name", header: "Name" },
  { key: "phone", header: "Phone" },
  { key: "accountNumber", header: "Account Number" },
  { key: "ifscCode", header: "IFSC Code" },
  {
    key: "requestedAmount",
    header: "Requested Amount",
    render: (row) => `₹${Number(row.requestedAmount ?? 0).toFixed(2)}`,
  },
  {
    key: "netAmount",
    header: "Net Amount",
    render: (row) => `₹${Number(row.netAmount ?? 0).toFixed(2)}`,
  },
  {
    key: "fee",
    header: "Fee",
    render: (row) => `₹${Number(row.fee ?? 0).toFixed(2)}`,
  },
  {
    key: "status",
    header: "Status",
    render: (row) => {
      const status = (row.status || "pending").toLowerCase();
      const isCompleted = status === "completed";
      const isFailed = status === "failed";
      const className = isCompleted
        ? "bg-green-400"
        : isFailed
          ? "bg-red-400"
          : "bg-amber-400";

      return (
        <p
          className={`px-2 py-1 rounded max-w-20 text-center text-gray-700 ${className} text-xs`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </p>
      );
    },
  },
  { key: "requestedAt", header: "Requested At" },
];

type WithdrawalRequestsProps = {
  requests: WithdrawalRequestType[] | undefined;
};

export const WithdrawalRequests = ({ requests }: WithdrawalRequestsProps) => {
  return <Table columns={columns} data={requests} />;
};
