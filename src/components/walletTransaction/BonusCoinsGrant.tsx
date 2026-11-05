import { useState } from "react";
import { Button, confirmAlert, Input, Select } from "../../ui";
import { showToast } from "../../ui/Toasters/toast.helper";
import { useGrantBonusCoinsMutation } from "../../hooks/mutations/wallet/useWalletAdjust";
import type {
  BonusCoinsGrantPayload,
  BonusCoinsGrantResult,
  BonusCoinsTargetGroup,
  BonusCoinsTargetType,
} from "../../types/wallet.type";
import { apiErrorMessage } from "../../utils/apiError";
import { formatCoins } from "../../utils/money";
import { UserPicker, type PickedUsers } from "./UserPicker";

const GROUP_OPTIONS: { label: string; value: BonusCoinsTargetGroup }[] = [
  { label: "All Clients", value: "all_clients" },
  { label: "All Employees", value: "all_employees" },
  { label: "Prime Users", value: "prime_users" },
  { label: "Non-Prime Users", value: "non_prime_users" },
  { label: "Male Users", value: "male_users" },
  { label: "Female Users", value: "female_users" },
];

/** The last run, kept so a partial failure can be retried with the same grantId. */
type LastGrant = { payload: BonusCoinsGrantPayload; result: BonusCoinsGrantResult; names: PickedUsers };

export const BonusCoinsGrant = () => {
  const [targetType, setTargetType] = useState<BonusCoinsTargetType>("group");
  const [targetGroup, setTargetGroup] = useState<BonusCoinsTargetGroup>("all_clients");
  const [selected, setSelected] = useState<PickedUsers>({});
  const [coins, setCoins] = useState("50");
  const [description, setDescription] = useState("Free bonus coins from admin");
  const [lastGrant, setLastGrant] = useState<LastGrant | null>(null);
  const [busy, setBusy] = useState(false);

  const { mutateAsync: grantBonusCoins } = useGrantBonusCoinsMutation();

  const send = async (payload: BonusCoinsGrantPayload, names: PickedUsers) => {
    setBusy(true);
    try {
      const { data: result } = await grantBonusCoins(payload);
      setLastGrant({ payload: { ...payload, grantId: result.grantId }, result, names });
      if (result.skippedUsers.length > 0) {
        showToast.warning(`Credited ${result.creditedUsers} of ${result.requestedUsers} users. Retry to pay the rest.`);
      } else {
        showToast.success(`Credited ${formatCoins(result.coinsPerUser)} coins to ${result.creditedUsers} users`);
      }
      return true;
    } catch (error) {
      showToast.error(apiErrorMessage(error, "Failed to credit bonus coins"));
      return false;
    } finally {
      setBusy(false);
    }
  };

  const handleGrant = async () => {
    const parsedCoins = Number(coins);
    if (!Number.isInteger(parsedCoins) || parsedCoins <= 0) {
      showToast.error("Coins must be a whole number greater than 0");
      return;
    }

    const userIds = Object.keys(selected);
    if (targetType === "specific_users" && userIds.length === 0) {
      showToast.error("Please select at least one male user");
      return;
    }

    const target =
      targetType === "group"
        ? GROUP_OPTIONS.find((g) => g.value === targetGroup)?.label ?? targetGroup
        : `${userIds.length} selected user(s)`;
    const confirmed = await confirmAlert({
      title: `Credit ${formatCoins(parsedCoins)} coins each?`,
      text: `To: ${target}`,
      confirmText: "Credit",
    });
    if (!confirmed) return;

    // A new run: no grantId, the backend issues one and returns it.
    const ok = await send(
      {
        coins: parsedCoins,
        description,
        targetType,
        group: targetType === "group" ? targetGroup : undefined,
        userIds: targetType === "specific_users" ? userIds : undefined,
      },
      selected
    );
    if (ok) setSelected({});
  };

  // Resends the same request with the same grantId: anyone already paid is skipped.
  const handleRetry = async () => {
    if (!lastGrant) return;
    await send(lastGrant.payload, lastGrant.names);
  };

  const result = lastGrant?.result;

  return (
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
            onChange={(value) => {
              setTargetType(value as BonusCoinsTargetType);
              setSelected({});
            }}
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
            options={GROUP_OPTIONS}
          />
        </div>

        <Input
          label="Coins Per User"
          type="number"
          min="1"
          step="1"
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
        <div className="mt-4">
          <UserPicker
            label="Search Male Users"
            selected={selected}
            onChange={setSelected}
            role="client"
            gender="male"
            emptyText="No male users found."
          />
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <Button variant="primary" onClick={handleGrant} loading={busy}>
          Credit Bonus Coins
        </Button>
      </div>

      {result && lastGrant && (
        <div
          className={`mt-4 rounded-lg border p-4 text-sm ${
            result.skippedUsers.length ? "border-yellow-300 bg-yellow-50" : "border-green-300 bg-green-50"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
            <div className="space-y-1">
              <p className="font-semibold text-gray-900">
                Credited {result.creditedUsers} of {result.requestedUsers} users ·{" "}
                {formatCoins(result.totalCoinsCredited)} coins total ({formatCoins(result.coinsPerUser)} each)
              </p>
              <p className="text-xs text-gray-500 break-all">Grant ID: {result.grantId}</p>
              {result.skippedUsers.length > 0 && (
                <>
                  <p className="text-gray-700">
                    {result.skippedUsers.length} user(s) were not paid. Retrying resends this grant with the
                    same Grant ID, so anyone already paid is skipped.
                  </p>
                  <ul className="max-h-32 overflow-y-auto text-xs text-gray-600">
                    {result.skippedUsers.map((id) => (
                      <li key={id} className="break-all">
                        {lastGrant.names[id] ? `${lastGrant.names[id]} (${id})` : id}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            <div className="flex gap-2">
              {result.skippedUsers.length > 0 && (
                <Button variant="primary" onClick={handleRetry} loading={busy}>
                  Retry Skipped
                </Button>
              )}
              <Button variant="action" onClick={() => setLastGrant(null)} disabled={busy}>
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
