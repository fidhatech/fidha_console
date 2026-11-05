// Mirrors the backend's CoinSettings / CoinSettingsView
// (fidhaapp: domain/entities/CoinSettings.ts, usecase/admin/CoinSettingsUseCase.ts).

export type PayoutRate = {
  /** Coins in the ratio, e.g. 1200 in "1200 coins = ₹50". */
  credits: number;
  /** Paise paid for `credits` coins. */
  amountMinor: number;
};

export type WithdrawalRules = {
  /** Smallest withdrawal, in coins. */
  minimumCredits: number;
  /** Percent of the withdrawal's rupee value, up to two decimals. */
  feePercent: number;
  /** Flat fee per withdrawal, in paise. */
  flatFeeMinor: number;
  /** Rupee caps (in paise) on the gross value withdrawn; 0 = no cap. */
  maxPerTransactionMinor: number;
  maxPerDayMinor: number;
  maxPerMonthMinor: number;
};

export type CoinSettings = {
  /** Platform's percent of every coin a caller pays, per call type. */
  commission: { audio: number; video: number };
  payoutRate: PayoutRate;
  withdrawal: WithdrawalRules;
  /** Free coins on signup (user) or on becoming an employee. 0 = off. */
  signupBonus: { user: number; employee: number };
  signupMessage: string;
  currency: string;
  updatedAt?: string;
};

export type EarningPreviewRow = {
  tier: "premium" | "standard";
  callType: "audio" | "video";
  ratePerMinute: number;
  earnCoinsPerMinute: number;
  earnRupeesPerMinute: number;
};

export type CoinSettingsView = CoinSettings & {
  rupeesPerCoin: number;
  earningPreview: EarningPreviewRow[];
};

/** PATCH body: every field optional; payoutRate must be sent whole. */
export type CoinSettingsPatch = {
  commission?: Partial<CoinSettings["commission"]>;
  payoutRate?: PayoutRate;
  withdrawal?: Partial<WithdrawalRules>;
  signupBonus?: Partial<CoinSettings["signupBonus"]>;
  signupMessage?: string;
};
