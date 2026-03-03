import { useState } from "react";
import {TransactionHistory} from "../components/walletTransaction/TransactionHistory";
import { WalletFigure } from "../components/walletTransaction/WalletFidget";
import { TableControls } from "../components/table/TableControls";
import { Pagination } from "../ui";
import { useWalletHistoryQuery, useWalletTractionQuery } from "../hooks/query/useWallet";
import { useDebounce } from "../hooks/useDebounce";

const WalletTransaction = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [startDate, setFromDate] = useState("");
  const [endDate, setToDate] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  const debouncedSearch = useDebounce(search, 500);
  const debouncedStartDate = useDebounce(startDate, 4000);
  const deboucedEndDate = useDebounce(endDate, 500);
  const deboucedSortBy = useDebounce(sortBy, 500);
  const deboucedSortOrder = useDebounce(sortOrder, 500);

  const {data: walletData} = useWalletTractionQuery();
  const {data: walletHistory} = useWalletHistoryQuery({
    page,
    search: debouncedSearch,
    startDate: debouncedStartDate,
    endDate: deboucedEndDate,
    sortBy: deboucedSortBy,
    sortOrder: deboucedSortOrder
  })

  const transactionHistory = walletHistory?.data;
  const pagination = walletHistory?.pagination;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <WalletFigure walletData={walletData} />
      </div>
      <div className="mt-8">
        <h1 className="mb-4 font-bold text-lg">Transaction History</h1>
        <TableControls
          search={search}
          onSearchChange={setSearch}
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
