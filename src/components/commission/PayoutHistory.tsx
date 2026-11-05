import { Table, type Column } from "../../ui";

export type PayoutHistoryType = {
  id: string | number;
  name: string;
  date: string;
  amount: number;
  avatar?: string;
  status: boolean;
  transactionId: string;
  /** Signed coins; `amount` is their ₹ value at the current payout rate. */
  coins?: number;
};

const columns: Column<PayoutHistoryType>[] = [
  { key: "name", header: "Name" },
  {
    key: "date",
    header: "Date",
  },
  {
    key: "coins",
    header: "Coins",
    render: (row) => (typeof row.coins === "number" ? row.coins.toLocaleString("en-IN") : "-"),
  },
  {
    key: "amount",
    header: "Amount (₹)",
  },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <p
        className={`px-2 py-1 rounded max-w-18 text-center text-gray-500 ${
          row.status ? "bg-green-400" : "bg-red-400"
        } text-xs`}
      >
        {row.status ? "Completed" : "Failed"}
      </p>
    ),
  },
  {
    key: "transactionId",
    header: "Transaction ID",
  },
];

type PayoutHistoryProps = {
  payoutHistoryData: PayoutHistoryType[] | undefined;
};

export const PayoutHistory = ({ payoutHistoryData }: PayoutHistoryProps) => {
  return (
    <>
      <Table columns={columns} data={payoutHistoryData} />
    </>
  );
};
