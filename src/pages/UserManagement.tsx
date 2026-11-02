import User from "../components/usermanagement/User";
import { TableControls } from "../components/table/TableControls";
import { Pagination } from "../ui";
import { useState } from "react";
import { confirmAlert } from "../ui";
import { useUserQuery } from "../hooks/query/useUser";
import { useDebounce } from "../hooks/useDebounce";
import { useUpdateUserMutation } from "../hooks/mutations/user/useUpdateUser";
import { toastPromise } from "../ui/Toasters/toast.helper";
import type { UserListType } from "../types/user.type";

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [startDate, setFromDate] = useState("");
  const [endDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [role, setRole] = useState("");

  const debouncedSearch = useDebounce(search, 500);
  const debouncedStartDate = useDebounce(startDate, 4000);
  const deboucedEndDate = useDebounce(endDate, 500);
  const deboucedSortBy = useDebounce(sortBy, 500);
  const deboucedSortOrder = useDebounce(sortOrder, 500);

  const derivedFilters = (() => {
    switch (role) {
      case "active":
        return { isBlocked: false };
      case "blocked":
        return { isBlocked: true };
      case "client":
        return { role: "client" };
      case "employee":
        return { role: "employee" };
      default:
        return {};
    }
  })();

  const { data } = useUserQuery({
    page,
    search: debouncedSearch,
    startDate: debouncedStartDate,
    endDate: deboucedEndDate,
    sortBy: deboucedSortBy,
    sortOrder: deboucedSortOrder,
    ...derivedFilters,
  });

  const users = data?.data;
  const pagination = data?.pagination;

  const { mutateAsync: updateUser } = useUpdateUserMutation();

  const handleBlockUser = async (user: UserListType) => {
    const block = !user.isBlocked;
    const label = user.name || user.phone || "this user";
    const confirmed = await confirmAlert({
      title: block ? `Block ${label}?` : `Unblock ${label}?`,
      text: block
        ? "They will be logged out immediately, cannot log in again, and will be hidden from the app."
        : "They will be able to log in and use the app again.",
      confirmText: block ? "Block" : "Unblock",
    });
    if (!confirmed) return;
    await toastPromise(updateUser({ id: user.id, isBlocked: block }), {
      pending: 'Request is processing',
      success: block ? 'User blocked' : 'User unblocked',
      error:'Something went wrong'
    });
  };

  return (
    <div>
      <TableControls
        search={search}
        onSearchChange={setSearch}
        dateFilterEnable={false}
        fromDate={startDate}
        toDate={endDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        selectEnalbe={true}
        role={role}
        onRoleChange={setRole}
        options={[
          { label: "All", value: "" },
          { label: "Active", value: "active" },
          { label: "Blocked", value: "blocked" },
          { label: "Client", value: "client" },
          { label: "Employee", value: "employee" },
        ]}
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

      <User users={users} onBlock={handleBlockUser} />

      <Pagination
        page={pagination?.page ?? 0}
        onPageChange={setPage}
        totalPages={pagination?.totalPages ?? 0}
      />
    </div>
  );
}
