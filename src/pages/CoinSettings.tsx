import { useEffect, useState, type ReactNode } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, confirmAlert, Input } from "../ui";
import { showToast } from "../ui/Toasters/toast.helper";
import { useCoinSettingsQuery } from "../hooks/query/useCoinSettings";
import { useUpdateCoinSettingsMutation } from "../hooks/mutations/coinSettings/useUpdateCoinSettings";
import {
  coinSettingsSchema,
  type CoinSettingsFormValues,
} from "../validation/schemas/coinSettings.schema";
import type { CoinSettingsPatch, CoinSettingsView } from "../types/coinSettings.type";
import { apiErrorMessage } from "../utils/apiError";
import { formatCoins, formatPaise, formatRupees, toPaise, toRupees } from "../utils/money";

const toFormValues = (s: CoinSettingsView): CoinSettingsFormValues => ({
  commissionAudio: s.commission.audio,
  commissionVideo: s.commission.video,
  payoutCredits: s.payoutRate.credits,
  payoutRupees: toRupees(s.payoutRate.amountMinor),
  minimumCredits: s.withdrawal.minimumCredits,
  feePercent: s.withdrawal.feePercent,
  flatFeeRupees: toRupees(s.withdrawal.flatFeeMinor),
  maxPerTransactionRupees: toRupees(s.withdrawal.maxPerTransactionMinor),
  maxPerDayRupees: toRupees(s.withdrawal.maxPerDayMinor),
  maxPerMonthRupees: toRupees(s.withdrawal.maxPerMonthMinor),
  signupBonusUser: s.signupBonus.user,
  signupBonusEmployee: s.signupBonus.employee,
  signupMessage: s.signupMessage,
});

/** Only the fields that differ from what is saved. payoutRate goes whole, as the API requires. */
const buildPatch = (v: CoinSettingsFormValues, s: CoinSettingsView): CoinSettingsPatch => {
  const patch: CoinSettingsPatch = {};

  const commission: CoinSettingsPatch["commission"] = {};
  if (v.commissionAudio !== s.commission.audio) commission.audio = v.commissionAudio;
  if (v.commissionVideo !== s.commission.video) commission.video = v.commissionVideo;
  if (Object.keys(commission).length) patch.commission = commission;

  const amountMinor = toPaise(v.payoutRupees);
  if (v.payoutCredits !== s.payoutRate.credits || amountMinor !== s.payoutRate.amountMinor) {
    patch.payoutRate = { credits: v.payoutCredits, amountMinor };
  }

  const w = s.withdrawal;
  const withdrawal: CoinSettingsPatch["withdrawal"] = {};
  if (v.minimumCredits !== w.minimumCredits) withdrawal.minimumCredits = v.minimumCredits;
  if (v.feePercent !== w.feePercent) withdrawal.feePercent = v.feePercent;
  const minorFields = [
    ["flatFeeMinor", v.flatFeeRupees],
    ["maxPerTransactionMinor", v.maxPerTransactionRupees],
    ["maxPerDayMinor", v.maxPerDayRupees],
    ["maxPerMonthMinor", v.maxPerMonthRupees],
  ] as const;
  for (const [key, rupees] of minorFields) {
    const minor = toPaise(rupees);
    if (minor !== w[key]) withdrawal[key] = minor;
  }
  if (Object.keys(withdrawal).length) patch.withdrawal = withdrawal;

  const signupBonus: CoinSettingsPatch["signupBonus"] = {};
  if (v.signupBonusUser !== s.signupBonus.user) signupBonus.user = v.signupBonusUser;
  if (v.signupBonusEmployee !== s.signupBonus.employee) signupBonus.employee = v.signupBonusEmployee;
  if (Object.keys(signupBonus).length) patch.signupBonus = signupBonus;

  if (v.signupMessage.trim() !== s.signupMessage) patch.signupMessage = v.signupMessage.trim();

  return patch;
};

const isNum = (n: unknown): n is number => typeof n === "number" && Number.isFinite(n);

/** Mirrors quoteWithdrawal() in the backend's coinEconomics: percent fee + flat fee, never above the gross. */
const quoteWithdrawal = (credits: number, rateCredits: number, rateMinor: number, feePercent: number, flatFeeMinor: number) => {
  const grossMinor = credits > 0 && rateCredits > 0 ? Math.round((credits * rateMinor) / rateCredits) : 0;
  const percentFee = Math.round((grossMinor * feePercent) / 100);
  const feeMinor = Math.min(grossMinor, percentFee + flatFeeMinor);
  return { grossMinor, feeMinor, netMinor: grossMinor - feeMinor };
};

const capLabel = (rupees: number | undefined) =>
  isNum(rupees) ? (rupees === 0 ? "No cap" : formatRupees(rupees)) : undefined;

const Section = ({ title, description, children }: { title: string; description: string; children: ReactNode }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
    {children}
  </div>
);

const CoinSettings = () => {
  const { data: settings, isLoading, isError } = useCoinSettingsQuery();
  const { mutateAsync: updateSettings } = useUpdateCoinSettingsMutation();
  const [saving, setSaving] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<CoinSettingsFormValues>({
    resolver: zodResolver(coinSettingsSchema),
  });

  // Load the saved values; a background refetch keeps whatever the admin is mid-way through editing.
  useEffect(() => {
    if (settings) reset(toFormValues(settings), { keepDirtyValues: true });
  }, [settings, reset]);

  const draft = useWatch({ control });

  if (isLoading) return <div className="p-4 text-gray-500">Loading...</div>;
  if (isError || !settings) return <div className="p-4 text-gray-500">Could not load coin settings.</div>;

  const draftRate =
    isNum(draft.payoutCredits) && draft.payoutCredits >= 1 && isNum(draft.payoutRupees) && draft.payoutRupees >= 0
      ? { credits: draft.payoutCredits, amountMinor: toPaise(draft.payoutRupees) }
      : settings.payoutRate;
  const draftRupeesPerCoin = draftRate.amountMinor / draftRate.credits / 100;

  const slipCredits = isNum(draft.minimumCredits) && draft.minimumCredits > 0 ? draft.minimumCredits : settings.withdrawal.minimumCredits;
  const slipFeePercent = isNum(draft.feePercent) ? draft.feePercent : settings.withdrawal.feePercent;
  const slipFlatFeeMinor = isNum(draft.flatFeeRupees) ? toPaise(draft.flatFeeRupees) : settings.withdrawal.flatFeeMinor;
  const slip = quoteWithdrawal(slipCredits, draftRate.credits, draftRate.amountMinor, slipFeePercent, slipFlatFeeMinor);

  const onSave = async (values: CoinSettingsFormValues) => {
    const patch = buildPatch(values, settings);
    if (Object.keys(patch).length === 0) {
      showToast.info("Nothing changed");
      return;
    }
    const confirmed = await confirmAlert({
      title: "Save coin settings?",
      text: "These apply to every call and withdrawal from the moment you save.",
      confirmText: "Save",
    });
    if (!confirmed) return;

    setSaving(true);
    try {
      const saved = await updateSettings(patch);
      reset(toFormValues(saved));
      showToast.success("Coin settings updated");
    } catch (error) {
      showToast.error(apiErrorMessage(error, "Failed to update coin settings"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-8">
      <Section
        title="Platform Commission"
        description="The platform's percent of every coin a caller pays. The employee is credited the rest, in coins."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Audio calls (%)"
            type="number"
            step="0.01"
            min="0"
            max="100"
            {...register("commissionAudio", { valueAsNumber: true })}
            error={errors.commissionAudio?.message}
          />
          <Input
            label="Video calls (%)"
            type="number"
            step="0.01"
            min="0"
            max="100"
            {...register("commissionVideo", { valueAsNumber: true })}
            error={errors.commissionVideo?.message}
          />
        </div>

        <div className="mt-6">
          <h3 className="mb-2 text-sm font-semibold text-gray-700">What employees earn per minute (saved settings)</h3>
          {settings.earningPreview.length === 0 ? (
            <p className="text-sm text-gray-500">No call rates configured yet.</p>
          ) : (
            <div className="w-full min-w-0 overflow-x-auto rounded-lg border">
              <table className="min-w-full w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    {["Tier", "Call", "Caller pays / min", "Employee earns / min", "Worth"].map((h) => (
                      <th key={h} className="px-4 py-2 text-left text-sm font-semibold text-gray-700">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {settings.earningPreview.map((row) => (
                    <tr key={`${row.tier}-${row.callType}`} className="border-t">
                      <td className="px-4 py-2 text-sm capitalize">{row.tier}</td>
                      <td className="px-4 py-2 text-sm capitalize">{row.callType}</td>
                      <td className="px-4 py-2 text-sm">{formatCoins(row.ratePerMinute)} coins</td>
                      <td className="px-4 py-2 text-sm">{formatCoins(row.earnCoinsPerMinute)} coins</td>
                      <td className="px-4 py-2 text-sm">{formatRupees(row.earnRupeesPerMinute)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="mt-2 text-xs text-gray-500">Call rates (what callers pay) are set on Coin Management.</p>
        </div>
      </Section>

      <Section
        title="Payout Rate"
        description="What an employee's coins are worth when she withdraws. A ratio, so values smaller than a paisa per coin still work."
      >
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-start">
          <Input
            label="Coins"
            type="number"
            step="1"
            min="1"
            {...register("payoutCredits", { valueAsNumber: true })}
            error={errors.payoutCredits?.message}
          />
          <span className="hidden md:block pt-9 text-gray-500">=</span>
          <Input
            label="Rupees (₹)"
            type="number"
            step="0.01"
            min="0"
            {...register("payoutRupees", { valueAsNumber: true })}
            error={errors.payoutRupees?.message}
          />
        </div>
        <p className="mt-3 text-sm text-gray-600">
          Saved: <strong>{formatRupees(settings.rupeesPerCoin, 4)}</strong> per coin
          {Math.abs(draftRupeesPerCoin - settings.rupeesPerCoin) > 1e-9 && (
            <> · After save: <strong>{formatRupees(draftRupeesPerCoin, 4)}</strong> per coin</>
          )}
        </p>
      </Section>

      <Section
        title="Withdrawal Rules"
        description="Apply to every employee withdrawal. Caps limit the rupee value withdrawn; 0 means no cap."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Smallest withdrawal (coins)"
            type="number"
            step="1"
            min="1"
            {...register("minimumCredits", { valueAsNumber: true })}
            error={errors.minimumCredits?.message}
          />
          <Input
            label="Fee (%)"
            type="number"
            step="0.01"
            min="0"
            max="100"
            {...register("feePercent", { valueAsNumber: true })}
            error={errors.feePercent?.message}
            helper="Of each withdrawal's rupee value"
          />
          <Input
            label="Flat fee (₹)"
            type="number"
            step="0.01"
            min="0"
            {...register("flatFeeRupees", { valueAsNumber: true })}
            error={errors.flatFeeRupees?.message}
            helper="Added to the percent fee"
          />
          <Input
            label="Max per transaction (₹)"
            type="number"
            step="0.01"
            min="0"
            {...register("maxPerTransactionRupees", { valueAsNumber: true })}
            error={errors.maxPerTransactionRupees?.message}
            helper={capLabel(draft.maxPerTransactionRupees)}
          />
          <Input
            label="Max per day (₹)"
            type="number"
            step="0.01"
            min="0"
            {...register("maxPerDayRupees", { valueAsNumber: true })}
            error={errors.maxPerDayRupees?.message}
            helper={capLabel(draft.maxPerDayRupees)}
          />
          <Input
            label="Max per month (₹)"
            type="number"
            step="0.01"
            min="0"
            {...register("maxPerMonthRupees", { valueAsNumber: true })}
            error={errors.maxPerMonthRupees?.message}
            helper={capLabel(draft.maxPerMonthRupees)}
          />
        </div>

        <div className="mt-6 max-w-md rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-sm">
          <p className="text-xs text-gray-500">An employee withdrawing the minimum</p>
          <dl className="mt-2 grid grid-cols-[1fr_auto] gap-y-1">
            <dt className="text-gray-600">{formatCoins(slipCredits)} coins</dt>
            <dd className="text-right">{formatPaise(slip.grossMinor)}</dd>
            <dt className="text-gray-600">Fees ({slipFeePercent}% + {formatPaise(slipFlatFeeMinor)})</dt>
            <dd className="text-right">− {formatPaise(slip.feeMinor)}</dd>
            <dt className="font-semibold text-gray-900 border-t border-dashed pt-1">Receives</dt>
            <dd className="text-right font-semibold text-gray-900 border-t border-dashed pt-1">{formatPaise(slip.netMinor)}</dd>
          </dl>
          {slip.netMinor === 0 && (
            <p className="mt-2 text-xs text-red-600">The fees cancel out the whole minimum, so an employee would receive nothing.</p>
          )}
        </div>
      </Section>

      <Section
        title="Signup Bonus"
        description="Free coins credited when an account is created (user) or becomes an employee. 0 turns it off."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="New user bonus (coins)"
            type="number"
            step="1"
            min="0"
            {...register("signupBonusUser", { valueAsNumber: true })}
            error={errors.signupBonusUser?.message}
          />
          <Input
            label="New employee bonus (coins)"
            type="number"
            step="1"
            min="0"
            {...register("signupBonusEmployee", { valueAsNumber: true })}
            error={errors.signupBonusEmployee?.message}
          />
        </div>
        <div className="mt-4 space-y-1">
          <label className="text-sm font-medium text-gray-700">Message shown with the bonus</label>
          <textarea
            rows={2}
            maxLength={200}
            {...register("signupMessage")}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
          {errors.signupMessage?.message ? (
            <span className="text-xs text-red-500">{errors.signupMessage.message}</span>
          ) : (
            <span className="text-xs text-gray-500">{(draft.signupMessage ?? "").length}/200</span>
          )}
        </div>
      </Section>

      <div className="flex justify-end gap-3">
        {isDirty && (
          <Button variant="action" onClick={() => reset(toFormValues(settings))} disabled={saving}>
            Discard
          </Button>
        )}
        <Button type="submit" variant="primary" loading={saving} disabled={!isDirty}>
          Save Coin Settings
        </Button>
      </div>
    </form>
  );
};

export default CoinSettings;
