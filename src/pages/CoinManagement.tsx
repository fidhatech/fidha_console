import { useState } from "react";
import { type PackageType } from "../types/coinManagement/package.type";
import { Button, confirmAlert, Pagination } from "../ui";
import { TableControls } from "../components/table/TableControls";
import {
  CoinFidget,
  CoinPackage,
  CreatePackageModal,
  EditPackageModal,
  type CoinPackageType,
} from "../components/coinManagement";
import EditCallRateModal from "../components/coinManagement/modals/CallRateEditor";
import type {
  CallRateDataType,
  CallRateType,
} from "../types/coinManagement/callRate.type";
import type { RowType1, RowType2 } from "../types/offer.types";
import OfferModal from "../components/modals/ViewModal";
import { useCallRateQuery, useCoinRatioQuery } from "../hooks/query/useCommission";
import { useCreateCoinMutation } from "../hooks/mutations/coin/useCreatePackage";
import { useUpdateCoinMutation } from "../hooks/mutations/coin/useUpdatePackage";
import { useDeleteCoinMutation } from "../hooks/mutations/coin/useDeletePackage";
import { useCoinsQuery } from "../hooks/query/useCoin";
import { useDebounce } from "../hooks/useDebounce";
import { useUpdateCallRateMutation, useUpdateCoinRatioMutation } from "../hooks/mutations/commission/useCommissionUpdate";
import { CoinRatioFidget } from "../components/commission/CoinRatioFidget";
import EditorCommisssionBonusModal from "../components/commission/CommissionBonusEditor";
import { toastPromise } from "../ui/Toasters/toast.helper";

const CoinManagement = () => {
  const [commissionOpen, setCommissionOpen] = useState(false);
  const [commissionType, setCommissionType] = useState("");
  const [coinRatioValue, setCoinRatioData] = useState<number>(0);

  const [callType, setType] = useState("premium");
  const [callRate, setCallRate] = useState<CallRateType>({
    audioCallRate: 0,

    videoCallRate: 0,
  });
  const [openCallEdit, setOpenCallEdit] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [toUpdateId, setToUpdateId] = useState<string>("");
  const [toUpdate, setToUpdate] = useState<CoinPackageType | undefined>();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [startDate, setFromDate] = useState("");
  const [endDate, setToDate] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<RowType1 | RowType2 | null>(
    null
  );

  const debouncedSearch = useDebounce(search, 500);
  const debouncedStartDate = useDebounce(startDate, 4000);
  const deboucedEndDate = useDebounce(endDate, 500);

  const { data: coinData } = useCoinsQuery({
    page,
    search: debouncedSearch,
    startDate: debouncedStartDate,
    endDate: deboucedEndDate,
    sortBy,
    sortOrder,
  });

  const { data: callRateData } = useCallRateQuery();
  const {data: coinRatioData} = useCoinRatioQuery();

  const coinPackages = coinData?.data ?? [];
  const pagination = coinData?.pagination;
 
  const { mutateAsync: createCoin } = useCreateCoinMutation();
  const { mutateAsync: updateCoin } = useUpdateCoinMutation();
  const { mutateAsync: deleteCoin } = useDeleteCoinMutation();

  const { mutateAsync: updateCallRate } = useUpdateCallRateMutation();
  const { mutateAsync: updateCommission } = useUpdateCoinRatioMutation();

  const handleViewPackage = (row: RowType1 | RowType2) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleCreatePackage = async (packageData: PackageType) => {
    const confirmed = await confirmAlert();
    if (!confirmed) return;
    await toastPromise(createCoin(packageData), {
      pending: 'Request is processing',
      success: 'Created successfully',
      error:'Something went wrong'
    });
  };

  const handleEditPackage = (id: string | number) => {
    if (!coinPackages) return;
    setOpenEdit(true);

    const updateData = coinPackages.filter((item) => item.id === id)[0];
    setToUpdateId(id as string);
    setToUpdate(updateData);
  };

  const handleUpdatePackage = async (updatedPackageData: PackageType) => {
    const confirmed = await confirmAlert();
    if (!confirmed) return;
    await toastPromise(updateCoin({
      id: toUpdateId,
      data: updatedPackageData,
    }), {
      pending: 'Request is processing',
      success: 'Updated successfully',
      error:'Something went wrong'
    });
  };

  const handleDeletePackage = async (id: string | number) => {
    const confirmed = await confirmAlert();
    if (!confirmed) return;
    await toastPromise(deleteCoin(id), {
      pending: 'Request is processing',
      success: 'Deleted successfully',
      error:'Something went wrong'
    });
  };

  const handleCallRateType = (type: string) => {
    setType(type);
    if (!callRateData) return;
    const callRate: CallRateDataType = callRateData.filter(
      (item) => item.type === type
    )[0];
    setCallRate({
      audioCallRate: callRate.coinsPerMinute.audioCallRate,
      videoCallRate: callRate.coinsPerMinute.videoCallRate,
    });
    setOpenCallEdit(true);
  };

  const handleCallRateUpdate = async (data: CallRateType) => {
    const confirmed = await confirmAlert();
    if (!confirmed) return;

    if (!callRateData) return;

    const id = callRateData[0].id;
    await toastPromise(updateCallRate({ id, data, type: callType }), {
      pending: 'Request is processing',
      success: 'Updated successfully',
      error:'Something went wrong'
    });
  };

  const handleCommissionEdit = async (updatedCommission: number) => {
    const confirmed = await confirmAlert();
    if (!confirmed) return;
    if (!coinRatioData) return;
    await toastPromise(updateCommission({
      id: coinRatioData.id,
      data: updatedCommission,
      type: commissionType,
    }), {
      pending: 'Request is processing',
      success: 'Updated successfully',
      error:'Something went wrong'
    });
  };

  const handleCommissionType = (type: string) => {
    setCommissionType(type);
    if (!coinRatioData) return;
    setCoinRatioData(coinRatioData.coinRatio);
    setCommissionOpen(true);
  };

  return (
    <div>
      <EditCallRateModal
        type={callType}
        callRateData={callRate}
        isOpen={openCallEdit}
        onEdit={handleCallRateUpdate}
        onClose={() => setOpenCallEdit(false)}
      />

      <CreatePackageModal
        isOpen={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreate={handleCreatePackage}
      />

      <EditPackageModal
        packageData={toUpdate}
        isOpen={openEdit}
        onClose={() => setOpenEdit(false)}
        onEdit={handleUpdatePackage}
      />

      <EditorCommisssionBonusModal
        data={coinRatioValue}
        isOpen={commissionOpen}
        onClose={() => setCommissionOpen(false)}
        onEdit={handleCommissionEdit}
        type={commissionType}
      />



      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CoinFidget
          callRateData={callRateData}
          onCallRate={handleCallRateType}
      />
      <CoinRatioFidget
       ratio={coinRatioData}
       onRatio={handleCommissionType}
      />
      </div>
      <div className="mt-8">
        <div className="flex mb-2 items-center justify-between">
          <h1 className="mb-4 font-bold text-lg">Coin Packages</h1>
          <Button
            type="button"
            onClick={() => setOpenCreate(true)}
            variant="primary"
          >
            + Create
          </Button>
        </div>

        <TableControls
          searchEnable={false}
          search={search}
          onSearchChange={setSearch}
          dateFilterEnable={true}
          fromDate={startDate}
          toDate={endDate}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
          sortEnable={false}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortByChange={setSortBy}
          onSortOrderChange={setSortOrder}
          sortOptions={[
            { label: "Date", value: "createdAt" },
            { label: "Name", value: "name" },
            { label: "Status", value: "status" },
          ]}
        />

        <CoinPackage
          coinPackageData={coinPackages}
          onDelete={handleDeletePackage}
          onEdit={handleEditPackage}
          onView={handleViewPackage}
        />

        <OfferModal
          onClose={() => setOpen(false)}
          open={open}
          row={selectedRow}
        />

        <Pagination
          page={pagination?.page ?? 1}
          totalPages={pagination?.totalPages ?? 1}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default CoinManagement;
