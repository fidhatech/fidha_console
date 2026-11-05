import type { ReactNode } from "react";
import { Link } from "react-router";
import { useCoinSettingsQuery } from "../../hooks/query/useCoinSettings";
import { formatCoins, formatPaise, formatRupees } from "../../utils/money";

type SummaryCard = "commission" | "payoutRate" | "withdrawal";

const EditLink = () => (
  <Link
    to="/admin/coin-settings"
    className="text-sm bg-gray-900 px-2 py-1 rounded text-white hover:underline h-fit"
  >
    Edit
  </Link>
);

const Card = ({ title, children, policy }: { title: string; children: ReactNode; policy: string }) => (
  <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-200 flex flex-col gap-3">
    <div className="flex justify-between">
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <EditLink />
    </div>
    {children}
    <span className="font-light text-xs text-gray-500">{policy}</span>
  </div>
);

/**
 * Read-only cards for the coin economy. The source of truth is
 * /coin-settings; editing happens on the Coin Settings page.
 */
export const CoinSettingsSummary = ({ show }: { show: SummaryCard[] }) => {
  const { data: settings, isLoading } = useCoinSettingsQuery();

  if (isLoading || !settings) {
    return (
      <>
        {show.map((key) => (
          <div key={key} className="rounded-xl bg-white p-5 shadow-sm border border-gray-200 animate-pulse space-y-3">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-8 w-32 bg-gray-200 rounded" />
          </div>
        ))}
      </>
    );
  }

  const { commission, payoutRate, withdrawal } = settings;

  return (
    <>
      {show.includes("commission") && (
        <Card
          title="Platform Commission"
          policy="The platform's share of every coin a caller pays. The employee earns the rest, in coins."
        >
          <p className="text-sm font-semibold text-gray-800">
            Audio <span className="text-xl">{commission.audio}%</span>
          </p>
          <p className="text-sm font-semibold text-gray-800">
            Video <span className="text-xl">{commission.video}%</span>
          </p>
        </Card>
      )}
      {show.includes("payoutRate") && (
        <Card
          title="Payout Rate"
          policy={`What an employee's coins are worth on withdrawal: ${formatRupees(settings.rupeesPerCoin, 4)} per coin.`}
        >
          <p className="text-2xl font-bold text-gray-900">
            {formatCoins(payoutRate.credits)} coins = {formatPaise(payoutRate.amountMinor)}
          </p>
        </Card>
      )}
      {show.includes("withdrawal") && (
        <Card
          title="Withdrawal Rules"
          policy={`Caps: ${[
            ["per transaction", withdrawal.maxPerTransactionMinor],
            ["per day", withdrawal.maxPerDayMinor],
            ["per month", withdrawal.maxPerMonthMinor],
          ]
            .map(([label, minor]) => `${minor ? formatPaise(minor as number) : "none"} ${label}`)
            .join(", ")}.`}
        >
          <p className="text-sm font-semibold text-gray-800">
            Minimum <span className="text-xl">{formatCoins(withdrawal.minimumCredits)} coins</span>
          </p>
          <p className="text-sm font-semibold text-gray-800">
            Fee <span className="text-xl">{withdrawal.feePercent}%</span>
            {withdrawal.flatFeeMinor > 0 && <> + {formatPaise(withdrawal.flatFeeMinor)}</>}
          </p>
        </Card>
      )}
    </>
  );
};
