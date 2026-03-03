import Verification from "../components/verification/Verification";
import { RejectionModal } from "../components/modals/RejectionModal";
import { useState } from "react";
import { TableControls } from "../components/table/TableControls";
import { confirmAlert, Pagination } from "../ui";
import { useOnboardQuery } from "../hooks/query/useVerification";
import { useDebounce } from "../hooks/useDebounce";
import {
  useUpdateRejectUserMutation,
  useUpdateVerifyUserMutation,
} from "../hooks/mutations/verification/useUpdateVerification";
import { toastPromise } from "../ui/Toasters/toast.helper";

export default function VerificationManagement() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [startDate, setFromDate] = useState("");
  const [endDate, setToDate] = useState("");
  const [sortBy] = useState("createdAt");
  const [sortOrder] = useState<"asc" | "desc">("desc");
  const [selectedUserId, setSelectedUserId] = useState<number | string | null>(
    null
  );

  const debouncedSearch = useDebounce(search, 500);
  const debouncedStartDate = useDebounce(startDate, 4000);
  const deboucedEndDate = useDebounce(endDate, 500);

  const { data } = useOnboardQuery({
    page,
    search: debouncedSearch,
    startDate: debouncedStartDate,
    endDate: deboucedEndDate,
    sortBy,
    sortOrder,
  });

  const userData = data?.data;
  const pagination = data?.pagination;

  const { mutateAsync: verifyUser } = useUpdateVerifyUserMutation();
  const { mutateAsync: rejectUser } = useUpdateRejectUserMutation();

  const handleReject = async (reason: string) => {
    if (!selectedUserId) return;
    const confiremd = await confirmAlert();
    if (!confiremd) return;
    await toastPromise(rejectUser({
      id: selectedUserId as string,
      data: reason,
    }), {
      pending: 'Request is processing',
      success: 'Updated successfully',
      error:'Something went wrong'
    });
    setOpen(false);
    setSelectedUserId(null);
  };

  const handleOpenRejectModal = (userId: number | string) => {
    setSelectedUserId(userId);
    setOpen(true);
  };

  const handleAccept = async (userId: number | string) => {
    const confiremd = await confirmAlert();
    if (!confiremd) return;
    await toastPromise(verifyUser(userId as string),
     {
      pending: 'Request is processing',
      success: 'Updated successfully',
      error:'Something went wrong'
    });
  };

  return (
    <>
      <RejectionModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleReject}
      />
      <TableControls
        search={search}
        onSearchChange={setSearch}
        dateFilterEnable={true}
        fromDate={startDate}
        toDate={endDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
      />

      <Verification
        onReject={handleOpenRejectModal}
        onAccept={handleAccept}
        data={userData}
      />

      <Pagination
        page={pagination?.page ?? 0}
        totalPages={pagination?.totalPages ?? 0}
        onPageChange={setPage}
      />
    </>
  );
}
