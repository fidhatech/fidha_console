import { Table, type Column } from "../../ui";

export type TransactionHistoryType = {
  id: number;
  name: string;
  date: string;
  amount: number;
  status: boolean;
  transactionId: string;
  type?: string;
};

const columns: Column<TransactionHistoryType>[] = [
  { key: "name", header: "Name" },
  {
    key: "date",
    header: "Date",
  },
  {
    key: "amount",
    header: "Amount",
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
        {row.status ? "Completed" : "Pending"}
      </p>
    ),
  },
  {
    key: "transactionId",
    header: "Transaction ID",
  },
  {
    key: "type",
    header: "Type",
    render: (row) => (
      <p className="px-2 py-1 rounded max-w-18 text-center text-gray-900">
        {row.type}
      </p>
    ),
  },
];

type TransactionHistoryProps = {
  transactionHistoryData: TransactionHistoryType[] | undefined;
};

export const TransactionHistory = ({
  transactionHistoryData,
}: TransactionHistoryProps) => {
  return (
    <>
      <Table columns={columns} data={transactionHistoryData} />
    </>
  );
};
