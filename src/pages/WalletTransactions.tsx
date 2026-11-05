import { useState } from "react";
import { Link } from "react-router";
import {TransactionHistory} from "../components/walletTransaction/TransactionHistory";
import { WalletFigure } from "../components/walletTransaction/WalletFidget";
import { BonusCoinsGrant } from "../components/walletTransaction/BonusCoinsGrant";
import { CoinsDeduct } from "../components/walletTransaction/CoinsDeduct";
import { TableControls } from "../components/table/TableControls";
import { Pagination } from "../ui";
import { useWalletHistoryQuery, useWalletTractionQuery } from "../hooks/query/useWallet";
import { useCoinSettingsQuery } from "../hooks/query/useCoinSettings";
import { useDebounce } from "../hooks/useDebounce";
import { LEDGER_TYPE_LABELS } from "../types/wallet.type";
import { formatCoins } from "../utils/money";

const TYPE_FILTER_OPTIONS = [
  { label: "All types", value: "" },
  ...Object.entries(LEDGER_TYPE_LABELS).map(([value, label]) => ({ label, value })),
];

const WalletTransaction = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [startDate, setFromDate] = useState("");
  const [endDate, setToDate] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [ledgerType, setLedgerType] = useState("");

  const debouncedSearch = useDebounce(search, 500);
  const debouncedStartDate = useDebounce(startDate, 4000);
  const deboucedEndDate = useDebounce(endDate, 500);
  const deboucedSortBy = useDebounce(sortBy, 500);
  const deboucedSortOrder = useDebounce(sortOrder, 500);

  const {data: walletData} = useWalletTractionQuery();
  const {data: coinSettings} = useCoinSettingsQuery();
  const {data: walletHistory} = useWalletHistoryQuery({
    page,
    search: debouncedSearch,
    startDate: debouncedStartDate,
    endDate: deboucedEndDate,
    sortBy: deboucedSortBy,
    sortOrder: deboucedSortOrder,
    type: ledgerType || undefined,
  })

  const transactionHistory = walletHistory?.data;
  const pagination = walletHistory?.pagination;

  const handleTypeChange = (value: string) => {
    setLedgerType(value);
    setPage(1);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <WalletFigure walletData={walletData} />
      </div>

      {/* The signup bonus now lives in coin settings, alongside the other coin rules. */}
      <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Signup Bonus</h2>
            {coinSettings ? (
              <p className="text-sm text-gray-600">
                New users get <strong>{formatCoins(coinSettings.signupBonus.user)}</strong> coins and new
                employees get <strong>{formatCoins(coinSettings.signupBonus.employee)}</strong> coins
                automatically. 0 turns a bonus off.
              </p>
            ) : (
              <p className="text-sm text-gray-600">Loading...</p>
            )}
          </div>
          <Link
            to="/admin/coin-settings"
            className="px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition text-center"
          >
            Edit in Coin Settings
          </Link>
        </div>
      </div>

      <BonusCoinsGrant />
      <CoinsDeduct />

      <div className="mt-8">
        <h1 className="mb-1 font-bold text-lg">Transaction History</h1>
        <p className="mb-4 text-sm text-gray-500">
          Every coin movement. To see one account's full ledger, open Wallet from User Management.
        </p>
        <TableControls
          search={search}
          onSearchChange={setSearch}
          selectEnalbe={true}
          role={ledgerType}
          onRoleChange={handleTypeChange}
          options={TYPE_FILTER_OPTIONS}
          dateFilterEnable={true}
          fromDate={startDate}
          toDate={endDate}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
          sortEnable={true}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortByChange={setSortBy}
          onSortOrderChange={setSortOrder}
          sortOptions={[
            { label: "Date", value: "createdAt" },
            { label: "Name", value: "name" },
          ]}
        />
        <TransactionHistory transactionHistoryData={transactionHistory} />

        <Pagination page={pagination?.page ?? 0} totalPages={pagination?.totalPages ?? 0} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default WalletTransaction;
