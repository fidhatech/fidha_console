import { useState } from "react";
import {
  type OfferType,
  type RowType1,
  type RowType2,
} from "../types/offer.types";
import { Button, confirmAlert, Pagination } from "../ui";
import { TableControls } from "../components/table/TableControls";
import OfferList, {
  type OfferFestivalType,
} from "../components/offerFestival/OfferList";
import { OfferCreator, OfferEditor } from "../components/offerFestival";
import OfferModal from "../components/modals/ViewModal";
import { useDebounce } from "../hooks/useDebounce";
import { useOffersQuery } from "../hooks/query/usePromotion";
import {
  useCreateOfferMutation,
  useDeleteOfferMutation,
  useUpdateOfferMutation,
} from "../hooks/mutations";
import { toastPromise } from "../ui/Toasters/toast.helper";

const OfferFestival = () => {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const [toUpdateId, setToUpdateId] = useState<string>("");
  const [toUpdate, setToUpdate] = useState<OfferFestivalType | undefined>();

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

  const debouncedSearch = useDebounce(search, 300);
  const debouncedStartDate = useDebounce(startDate, 4000);
  const deboucedEndDate = useDebounce(endDate, 500);

  const { data } = useOffersQuery({
    page,
    search: debouncedSearch,
    startDate: debouncedStartDate,
    endDate: deboucedEndDate,
    sortBy,
    sortOrder,
  });

  const promotions = data?.data ?? [];
  const pagination = data?.pagination;

  const { mutateAsync: createOffer } = useCreateOfferMutation();
  const { mutateAsync: updateOffer } = useUpdateOfferMutation();
  const { mutateAsync: deleteOffer } = useDeleteOfferMutation();

  const handleViewOffer = (row: RowType1 | RowType2) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleEditOffer = (id: string | number) => {
    if (data) {
      const update = promotions.filter((item) => item.id === id)[0];
      setToUpdate(update);
      setToUpdateId(id as string);
      setOpenEditModal(true);
    }
  };

  const handleUpdateOffer = async (updatedOfferData: OfferType) => {
    const confirmed = await confirmAlert();
    if (!confirmed) return;
    if (!toUpdate) return;
    await toastPromise(updateOffer(
      { id: toUpdateId,
        data: updatedOfferData }
    ), {
      pending: 'Request is processing',
      success: 'Updated successfully',
      error:'Something went wrong'
    });
  };

  const handleDeleteOffer = async (id: string | number) => {
    const confirmed = await confirmAlert();
    if (!confirmed) return;

    await toastPromise(deleteOffer(id), {
      pending: 'Request is processing',
      success: 'Deleted successfully',
      error:'Something went wrong'
    });
  };

  const handleCreateOffer = async (offerData: OfferType) => {
    const confirmed = await confirmAlert();
    if (!confirmed) return;

    await toastPromise(createOffer(offerData), {
      pending: 'Request is processing',
      success: 'Created successfully',
      error:'Something went wrong'
    });
    setOpenCreateModal(false);
  };

  return (
    <div>
      <div className="flex mb-2 items-center justify-between">
        <h1 className="mb-4 font-bold text-lg">Offer List</h1>
        <Button
          type="button"
          onClick={() => setOpenCreateModal(true)}
          variant="primary"
        >
          + Create
        </Button>
      </div>

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
          { label: "Active", value: "active" },
          { label: "Expired", value: "expired" },
        ]}
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

      <OfferList
        onView={handleViewOffer}
        onEdit={handleEditOffer}
        onDelete={handleDeleteOffer}
        offerData={promotions}
      />

      <Pagination
        page={pagination?.page ?? 0}
        totalPages={pagination?.totalPages ?? 0}
        onPageChange={setPage}
      />

      <OfferCreator
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onCreate={handleCreateOffer}
      />

      <OfferEditor
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
        offerData={toUpdate}
        onEdit={handleUpdateOffer}
      />

      <OfferModal
        onClose={() => setOpen(false)}
        open={open}
        row={selectedRow}
      />
    </div>
  );
};

export default OfferFestival;
