import { Table, type Column } from "../../ui";
import { ledgerTypeLabel, type TransactionHistoryType } from "../../types/wallet.type";
import { formatCoins, formatRupees, formatSignedCoins } from "../../utils/money";

export type { TransactionHistoryType };

// Every row is a coin-ledger movement. `amount` is rupees and only set on top-ups.
const columns: Column<TransactionHistoryType>[] = [
  { key: "name", header: "Name" },
  {
    key: "role",
    header: "Role",
    render: (row) => (
      <p
        className={`px-2 py-1 rounded max-w-18 text-center text-blue-700 ${
          row.role === "employee" ? "bg-blue-300" : "bg-blue-100"
        } text-xs capitalize`}
      >
        {row.role ?? "-"}
      </p>
    ),
  },
  {
    key: "date",
    header: "Date",
    render: (row) => <span className="whitespace-nowrap">{row.date}</span>,
  },
  {
    key: "type",
    header: "Type",
    render: (row) => (
      <span className="px-2 py-1 rounded bg-gray-100 text-xs text-gray-800 whitespace-nowrap">
        {ledgerTypeLabel(row.type)}
      </span>
    ),
  },
  {
    key: "coins",
    header: "Coins",
    render: (row) =>
      typeof row.coins === "number" ? (
        <span className={`font-medium ${row.coins < 0 ? "text-red-600" : "text-green-700"}`}>
          {formatSignedCoins(row.coins)}
        </span>
      ) : (
        <span>-</span>
      ),
  },
  {
    key: "balanceAfter",
    header: "Balance After",
    render: (row) => (
      <span>{typeof row.balanceAfter === "number" ? formatCoins(row.balanceAfter) : "-"}</span>
    ),
  },
  {
    key: "amount",
    header: "Amount",
    render: (row) => <span>{row.amount ? formatRupees(row.amount) : "-"}</span>,
  },
  {
    key: "note",
    header: "Note",
    render: (row) => <span className="text-gray-700">{row.note || "-"}</span>,
  },
  {
    key: "transactionId",
    header: "Transaction ID",
    render: (row) => {
      const value = row.transactionId?.toString().trim();
      return <span className="text-xs break-all">{value ? value : "N/A"}</span>;
    },
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
