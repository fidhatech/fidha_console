import { useState } from "react";
import { Button, confirmAlert, Input, Select } from "../../ui";
import { showToast } from "../../ui/Toasters/toast.helper";
import { useDeductCoinsMutation } from "../../hooks/mutations/wallet/useWalletAdjust";
import type { CoinsDeductPayload, CoinsDeductResult } from "../../types/wallet.type";
import { apiErrorMessage } from "../../utils/apiError";
import { formatCoins } from "../../utils/money";
import { UserPicker, type PickedUsers } from "./UserPicker";

type LastDeduct = { payload: CoinsDeductPayload; result: CoinsDeductResult; names: PickedUsers };

export const CoinsDeduct = () => {
  const [role, setRole] = useState("");
  const [selected, setSelected] = useState<PickedUsers>({});
  const [coins, setCoins] = useState("");
  const [reason, setReason] = useState("");
  const [last, setLast] = useState<LastDeduct | null>(null);
  const [busy, setBusy] = useState(false);

  const { mutateAsync: deductCoins } = useDeductCoinsMutation();

  const send = async (payload: CoinsDeductPayload, names: PickedUsers) => {
    setBusy(true);
    try {
      const { data: result } = await deductCoins(payload);
      setLast({ payload, result, names });
      if (result.skippedUsers.length > 0) {
        showToast.warning(`${result.skippedUsers.length} user(s) could not be updated`);
      } else {
        showToast.success(`Removed ${formatCoins(result.totalCoinsDeducted)} coins`);
      }
      return true;
    } catch (error) {
      showToast.error(apiErrorMessage(error, "Failed to remove coins"));
      return false;
    } finally {
      setBusy(false);
    }
  };

  const handleDeduct = async () => {
    const parsedCoins = Number(coins);
    if (!Number.isInteger(parsedCoins) || parsedCoins <= 0) {
      showToast.error("Coins must be a whole number greater than 0");
      return;
    }
    if (!reason.trim()) {
      showToast.error("A reason is required. The user sees it on their wallet.");
      return;
    }
    const userIds = Object.keys(selected);
    if (userIds.length === 0) {
      showToast.error("Please select at least one user");
      return;
    }

    const confirmed = await confirmAlert({
      title: `Remove up to ${formatCoins(parsedCoins)} coins each?`,
      text: `From ${userIds.length} user(s). Never takes a balance below zero.`,
      confirmText: "Remove",
    });
    if (!confirmed) return;

    const ok = await send({ userIds, coins: parsedCoins, reason: reason.trim() }, selected);
    if (ok) setSelected({});
  };

  // Deductions carry no idempotency key, so only the users that failed are resent.
  const handleRetrySkipped = async () => {
    if (!last || last.result.skippedUsers.length === 0) return;
    await send({ ...last.payload, userIds: last.result.skippedUsers }, last.names);
  };

  const result = last?.result;
  const nameOf = (id: string) => last?.names[id] ?? id;

  return (
    <div className="mt-8 rounded-xl border border-red-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Remove Coins</h2>
        <p className="text-sm text-gray-500">
          Take coins out of specific accounts. The reason is shown to the user on their wallet. A balance never goes below zero.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[180px_160px_1fr] gap-4 items-end">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Account Type</label>
          <Select
            value={role}
            onChange={setRole}
            options={[
              { label: "All", value: "" },
              { label: "Clients", value: "client" },
              { label: "Employees", value: "employee" },
            ]}
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
          label="Reason (required)"
          value={reason}
          maxLength={200}
          placeholder="e.g. Reversed a duplicate bonus"
          onChange={(event) => setReason(event.target.value)}
        />
      </div>

      <div className="mt-4">
        <UserPicker
          label="Search Users"
          selected={selected}
          onChange={setSelected}
          role={role || undefined}
        />
      </div>

      <div className="mt-4 flex justify-end">
        <Button variant="danger" onClick={handleDeduct} loading={busy}>
          Remove Coins
        </Button>
      </div>

      {result && (
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
          <div className="flex items-start justify-between gap-3">
            <p className="font-semibold text-gray-900">
              Removed {formatCoins(result.totalCoinsDeducted)} coins from {result.results.length} of{" "}
              {result.requestedUsers} users
            </p>
            <div className="flex gap-2">
              {result.skippedUsers.length > 0 && (
                <Button variant="primary" onClick={handleRetrySkipped} loading={busy}>
                  Retry Failed
                </Button>
              )}
              <Button variant="action" onClick={() => setLast(null)} disabled={busy}>
                Dismiss
              </Button>
            </div>
          </div>

          <div className="mt-3 w-full overflow-x-auto rounded-lg border bg-white">
            <table className="min-w-full w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  {["User", "Removed", "Balance Now", "Result"].map((h) => (
                    <th key={h} className="px-4 py-2 text-left text-sm font-semibold text-gray-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.results.map((r) => (
                  <tr key={r.userId} className="border-t">
                    <td className="px-4 py-2 text-sm">{nameOf(r.userId)}</td>
                    <td className="px-4 py-2 text-sm text-red-600">−{formatCoins(r.deducted)}</td>
                    <td className="px-4 py-2 text-sm">{formatCoins(r.balance)}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {r.deducted === 0
                        ? "Balance was already 0"
                        : r.deducted < (last?.payload.coins ?? 0)
                          ? "Partial: balance ran out"
                          : "Removed"}
                    </td>
                  </tr>
                ))}
                {result.skippedUsers.map((id) => (
                  <tr key={id} className="border-t">
                    <td className="px-4 py-2 text-sm">{nameOf(id)}</td>
                    <td className="px-4 py-2 text-sm">-</td>
                    <td className="px-4 py-2 text-sm">-</td>
                    <td className="px-4 py-2 text-sm text-red-600">Failed</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
