import { Link, useLocation, useParams } from "react-router";
import { Button, Table, type Column } from "../ui";
import { useUserWalletQuery } from "../hooks/query/useWallet";
import { ledgerTypeLabel, type LedgerEntry } from "../types/wallet.type";
import { formatCoins, formatPaise, formatSignedCoins } from "../utils/money";
import { apiErrorMessage } from "../utils/apiError";

const formatDateTime = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
};

const columns: Column<LedgerEntry>[] = [
  {
    key: "createdAt",
    header: "Date",
    render: (row) => <span className="whitespace-nowrap">{formatDateTime(row.createdAt)}</span>,
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
    key: "amount",
    header: "Coins",
    render: (row) => (
      <span className={`font-medium ${row.amount < 0 ? "text-red-600" : "text-green-700"}`}>
        {formatSignedCoins(row.amount)}
      </span>
    ),
  },
  {
    key: "balanceAfter",
    header: "Balance After",
    render: (row) => <span>{row.balanceAfter === null ? "-" : formatCoins(row.balanceAfter)}</span>,
  },
  {
    key: "amountMinor",
    header: "Money",
    render: (row) => <span>{row.amountMinor ? formatPaise(row.amountMinor) : "-"}</span>,
  },
  {
    key: "note",
    header: "Note",
    render: (row) => <span className="text-gray-700">{row.note || "-"}</span>,
  },
  {
    key: "reference",
    header: "Reference",
    render: (row) => (
      <span className="text-xs text-gray-500 break-all">{row.reference || "-"}</span>
    ),
  },
];

const UserWallet = () => {
  const { userId } = useParams();
  const location = useLocation();
  const accountName = (location.state as { name?: string } | null)?.name;

  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserWalletQuery(userId);

  const pages = data?.pages ?? [];
  const balance = pages[0]?.balance;
  const entries = pages.flatMap((page) => page.transactions);

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Link to="/admin/user-management" className="text-sm text-blue-600 hover:underline">
            ← User Management
          </Link>
          <h1 className="mt-1 font-bold text-lg">
            Wallet{accountName ? ` · ${accountName}` : ""}
          </h1>
          <p className="text-xs text-gray-500 break-all">{userId}</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-200 min-w-56">
          <p className="text-sm text-gray-500 font-medium">Balance</p>
          <p className="text-3xl font-bold text-gray-900">
            {balance === undefined ? "-" : `${formatCoins(balance)} coins`}
          </p>
        </div>
      </div>

      {error ? (
        <div className="p-4 text-red-600">{apiErrorMessage(error, "Could not load this wallet")}</div>
      ) : (
        <Table columns={columns} data={entries} loading={isLoading} />
      )}

      {hasNextPage && (
        <div className="mt-4 flex justify-center">
          <Button variant="secondary" loading={isFetchingNextPage} onClick={() => fetchNextPage()}>
            Load more
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserWallet;
