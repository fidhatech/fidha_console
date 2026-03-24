import { useEffect, useState } from "react";
import {TransactionHistory} from "../components/walletTransaction/TransactionHistory";
import { WalletFigure } from "../components/walletTransaction/WalletFidget";
import { TableControls } from "../components/table/TableControls";
import { Pagination, Button, Input, Select } from "../ui";
import { useWalletHistoryQuery, useWalletTractionQuery } from "../hooks/query/useWallet";
import { useDebounce } from "../hooks/useDebounce";
import { toastPromise } from "../ui/Toasters/toast.helper";
import { grantBonusCoinsApi } from "../api/wallet.api";
import type { BonusCoinsTargetGroup, BonusCoinsTargetType } from "../types/wallet.type";
import { useSignupBonusQuery } from "../hooks/query/useCommission";
import { useUpdateSignupBonusMutation } from "../hooks/mutations/commission/useCommissionUpdate";
import { useUserQuery } from "../hooks/query/useUser";
import { showToast } from "../ui/Toasters/toast.helper";

const WalletTransaction = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [startDate, setFromDate] = useState("");
  const [endDate, setToDate] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [targetType, setTargetType] = useState<BonusCoinsTargetType>("group");
  const [targetGroup, setTargetGroup] = useState<BonusCoinsTargetGroup>("all_clients");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [coins, setCoins] = useState("50");
  const [description, setDescription] = useState("Free bonus coins from admin");
  const [signupBonusCoins, setSignupBonusCoins] = useState("0");
  
  const debouncedSearch = useDebounce(search, 500);
  const debouncedStartDate = useDebounce(startDate, 4000);
  const deboucedEndDate = useDebounce(endDate, 500);
  const deboucedSortBy = useDebounce(sortBy, 500);
  const deboucedSortOrder = useDebounce(sortOrder, 500);
  const debouncedUserSearch = useDebounce(userSearch, 400);

  const {data: walletData} = useWalletTractionQuery();
  const {data: signupBonus} = useSignupBonusQuery();
  const {mutateAsync: updateSignupBonus} = useUpdateSignupBonusMutation();
  const { data: maleUsersData, isLoading: maleUsersLoading } = useUserQuery({
    page: 1,
    pageSize: 100,
    search: debouncedUserSearch,
    startDate: "",
    endDate: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    role: "client",
    gender: "male",
  });
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
  const maleUsers = maleUsersData?.data ?? [];

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSaveSignupBonus = async () => {
    if (!signupBonus) return;

    const parsedCoins = Math.max(0, Number(signupBonusCoins));
    if (!Number.isFinite(parsedCoins)) {
      return;
    }

    await toastPromise(updateSignupBonus({
      id: signupBonus.id,
      data: parsedCoins,
      type: "signupBonusCoins",
    }), {
      pending: "Saving signup bonus",
      success: "Signup bonus updated",
      error: "Failed to update signup bonus",
    });
  };

  useEffect(() => {
    if (!signupBonus) return;
    setSignupBonusCoins(String(signupBonus.signupBonusCoins ?? 0));
  }, [signupBonus]);

  useEffect(() => {
    if (targetType === "group") {
      setSelectedUserIds([]);
      setUserSearch("");
    }
  }, [targetType]);

  const handleGrantBonusCoins = async () => {
    const parsedCoins = Number(coins);
    if (!Number.isFinite(parsedCoins) || parsedCoins <= 0) {
      return;
    }

    if (targetType === "specific_users" && selectedUserIds.length === 0) {
      showToast.error("Please select at least one male user");
      return;
    }

    const payload = {
      coins: parsedCoins,
      description,
      targetType,
      group: targetType === "group" ? targetGroup : undefined,
      userIds:
        targetType === "specific_users"
          ? selectedUserIds
          : undefined,
    };

    await toastPromise(grantBonusCoinsApi(payload), {
      pending: "Crediting bonus coins",
      success: "Bonus coins credited successfully",
      error: "Failed to credit bonus coins",
    });

    setSelectedUserIds([]);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <WalletFigure walletData={walletData} />
      </div>
      <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">New User Signup Bonus</h2>
            <p className="text-sm text-gray-600">Every newly registered user will automatically receive this number of coins in their wallet.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr_auto] gap-4 items-end">
          <Input
            label="Signup Bonus Coins"
            type="number"
            min="0"
            value={signupBonusCoins}
            onChange={(event) => setSignupBonusCoins(event.target.value)}
          />
          <p className="text-sm text-gray-600">
            If set to <strong>0</strong>, new users get 0 coins. If set to <strong>200</strong>, every new registered user gets 200 coins automatically.
          </p>
          <Button variant="primary" onClick={handleSaveSignupBonus}>
            Save Signup Bonus
          </Button>
        </div>
      </div>
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Free Bonus Coins</h2>
            <p className="text-sm text-gray-500">Credit bonus coins to a user group or specific users.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Target Type</label>
            <Select
              value={targetType}
              onChange={(value) => setTargetType(value as BonusCoinsTargetType)}
              options={[
                { label: "User Group", value: "group" },
                { label: "Specific Users", value: "specific_users" },
              ]}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Target Group</label>
            <Select
              value={targetGroup}
              onChange={(value) => setTargetGroup(value as BonusCoinsTargetGroup)}
              options={[
                { label: "All Clients", value: "all_clients" },
                { label: "All Employees", value: "all_employees" },
                { label: "Prime Users", value: "prime_users" },
                { label: "Non-Prime Users", value: "non_prime_users" },
                { label: "Male Users", value: "male_users" },
                { label: "Female Users", value: "female_users" },
              ]}
            />
          </div>

          <Input
            label="Coins Per User"
            type="number"
            min="1"
            value={coins}
            onChange={(event) => setCoins(event.target.value)}
          />

          <Input
            label="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        {targetType === "specific_users" && (
          <div className="mt-4 space-y-3">
            <Input
              label="Search Male Users"
              value={userSearch}
              onChange={(event) => setUserSearch(event.target.value)}
              placeholder="Search by name or phone"
            />

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Selected users: <strong>{selectedUserIds.length}</strong>
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setSelectedUserIds(maleUsers.map((user) => user.id))}
                >
                  Select Visible
                </Button>
                <Button variant="secondary" onClick={() => setSelectedUserIds([])}>
                  Clear
                </Button>
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200 p-2">
              {maleUsersLoading ? (
                <p className="px-2 py-3 text-sm text-gray-500">Loading male users...</p>
              ) : maleUsers.length === 0 ? (
                <p className="px-2 py-3 text-sm text-gray-500">No male users found.</p>
              ) : (
                maleUsers.map((user) => {
                  const isChecked = selectedUserIds.includes(user.id);

                  return (
                    <label
                      key={user.id}
                      className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 hover:bg-gray-50"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.phone}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleUserSelection(user.id)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                  );
                })
              )}
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <Button variant="primary" onClick={handleGrantBonusCoins}>
            Credit Bonus Coins
          </Button>
        </div>
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
