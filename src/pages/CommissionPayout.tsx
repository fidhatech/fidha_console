import { useState } from "react";
import { CommissionFidget } from "../components/commission/CommissionFidget";
import { PayoutHistory } from "../components/commission/PayoutHistory";
import { WithdrawalRequests } from "../components/commission/WithdrawalRequests";
import { TableControls } from "../components/table/TableControls";
import { confirmAlert, Pagination } from "../ui";
import EditorCommisssionBonusModal from "../components/commission/CommissionBonusEditor";
import {
  useCommissionQuery,
  usePayoutQuery,
  useWithdrawalRequestsQuery,
} from "../hooks/query/useCommission";
import { useUpdateCommissionMutation } from "../hooks/mutations/commission/useCommissionUpdate";
import { useDebounce } from "../hooks/useDebounce";
import { toastPromise } from "../ui/Toasters/toast.helper";

const CommissionPayout = () => {
  const [commissionOpen, setCommissionOpen] = useState(false);
  const [commissionType, setCommissionType] = useState("");
  const [commissionData, setCommissionData] = useState<number>(0);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [startDate, setFromDate] = useState("");
  const [endDate, setToDate] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const debouncedSearch = useDebounce(search, 500);
  const debouncedStartDate = useDebounce(startDate, 4000);
  const deboucedEndDate = useDebounce(endDate, 500);
  const deboucedSortBy = useDebounce(sortBy, 500);
  const deboucedSortOrder = useDebounce(sortOrder, 500);


  const { data: commissions } = useCommissionQuery();
  const { mutateAsync: updateCommission } = useUpdateCommissionMutation();

  const { data: payoutHistory } = usePayoutQuery({
    page,
    search: debouncedSearch,
    startDate: debouncedStartDate,
    endDate: deboucedEndDate,
    sortBy: deboucedSortBy,
    sortOrder: deboucedSortOrder,

  });

  const payoutHistoryData = payoutHistory?.data;
  const pagination = payoutHistory?.pagination;

  const { data: withdrawalRequests } = useWithdrawalRequestsQuery({
    page,
    search: debouncedSearch,
    startDate: debouncedStartDate,
    endDate: deboucedEndDate,
    sortBy: deboucedSortBy,
    sortOrder: deboucedSortOrder,
  });

  const withdrawalRequestData = withdrawalRequests?.data;
  const totalRequestedAmount = withdrawalRequests?.totalRequestedAmount ?? 0;

  const handleCommissionEdit = async (updatedCommission: number) => {
    const confirmed = await confirmAlert();
    if (!confirmed) return;
    if (!commissions) return;
    await toastPromise(updateCommission({
      id: commissions[0].id,
      data: updatedCommission,
      type: commissionType,
    }), {
      pending: 'Request is processing',
      success: 'Updated in successfully',
      error:'Something went wrong'
    })
  };

  const handleCommissionType = (type: string) => {
    setCommissionType(type);
    if (!commissions) return;
    let data = commissions.filter((item) => item.type === type)[0];
    setCommissionData(data.commissionPercentage);
    setCommissionOpen(true);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <EditorCommisssionBonusModal
          data={commissionData}
          isOpen={commissionOpen}
          onClose={() => setCommissionOpen(false)}
          onEdit={handleCommissionEdit}
          type={commissionType}
        />

        <CommissionFidget
          commissionData={commissions}
          onCommissionType={handleCommissionType}
        />
      </div>
      <div className="mt-8">
        <h1 className="mb-2 font-bold text-lg">Withdrawal Requests</h1>
        <p className="mb-4 text-sm text-gray-300">
          Total Requested Amount: ₹{totalRequestedAmount.toFixed(2)}
        </p>
        <WithdrawalRequests requests={withdrawalRequestData} />
      </div>

      <div className="mt-8">
        <h1 className="mb-4 font-bold text-lg">Payout History</h1>
        <TableControls
          search={search}
          onSearchChange={setSearch}
          dateFilterEnable={true}
          fromDate={startDate}
          toDate={endDate}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
          selectEnalbe={false}
          options={[
            { label: "All", value: "all" },
            { label: "Success", value: "Success" },
            { label: "Failed", value: "failed" },
          ]}
          sortEnable={true}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortByChange={setSortBy}
          onSortOrderChange={setSortOrder}
          sortOptions={[
            { label: "Date", value: "date" },
            { label: "Name", value: "name" },
            { label: "Status", value: "status" },
          ]}
        />

        <PayoutHistory payoutHistoryData={payoutHistoryData} />
        <Pagination
          page={pagination?.page ?? 0}
          totalPages={pagination?.totalPages ?? 0}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default CommissionPayout;
