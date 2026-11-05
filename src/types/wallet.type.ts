export type WalletFigureType = {
        title: string,
        figure: number,
        growth: number,
};

/** Ledger row types (backend domain/enums/LedgerType.ts). */
export const LEDGER_TYPE_LABELS: Record<string, string> = {
    topup: "Top-up",
    topup_reversal: "Top-up refund",
    call_debit: "Call charge",
    call_credit: "Call earning",
    call_refund: "Call refund",
    call_credit_reversal: "Call earning reversed",
    withdrawal_debit: "Withdrawal",
    withdrawal_refund: "Withdrawal refund",
    signup_bonus: "Signup bonus",
    admin_grant: "Admin grant",
    admin_deduct: "Admin deduction",
    bonus_forfeit: "Bonus forfeited",
    earnings_migration: "Earnings migration",
    legacy: "Legacy",
};

export const ledgerTypeLabel = (type?: string | null) =>
    (type && LEDGER_TYPE_LABELS[type]) || type || "-";

export type TransactionHistoryType = {
    id: number | string,
    name: string,
    date: string,
    /** Rupees, top-ups only (0 otherwise). */
    amount: number,
    status: boolean,
    transactionId: string,
    type?: string,
    /** Signed coins moved. */
    coins?: number,
    balanceAfter?: number | null,
    /** Account role: "client" or "employee". */
    role?: string,
    note?: string | null,
};

export type BonusCoinsTargetType = "specific_users" | "group";

export type BonusCoinsTargetGroup =
    | "all_clients"
    | "all_employees"
    | "prime_users"
    | "non_prime_users"
    | "male_users"
    | "female_users";

export type BonusCoinsGrantPayload = {
    coins: number;
    description?: string;
    /** Re-send the id of a grant that failed part-way to pay only those it missed. */
    grantId?: string;
    targetType: BonusCoinsTargetType;
    group?: BonusCoinsTargetGroup;
    userIds?: string[];
};

export type BonusCoinsGrantResult = {
    creditedUsers: number;
    requestedUsers: number;
    coinsPerUser: number;
    totalCoinsCredited: number;
    skippedUsers: string[];
    targetType: BonusCoinsTargetType;
    group?: BonusCoinsTargetGroup;
    grantId: string;
};

export type CoinsDeductPayload = {
    userIds: string[];
    coins: number;
    /** Required: shown to the account holder on their ledger row. */
    reason: string;
};

export type CoinsDeductResult = {
    requestedUsers: number;
    /** Coins actually removed per user, never more than they held. */
    results: { userId: string; deducted: number; balance: number }[];
    skippedUsers: string[];
    totalCoinsDeducted: number;
};

export type WalletActionResponse<T> = {
    message: string;
    data: T;
};

export type LedgerEntry = {
    id: string;
    type: string;
    /** Signed whole coins. */
    amount: number;
    balanceAfter: number | null;
    reference: string | null;
    note: string | null;
    /** Paise involved, where money moved (a top-up's price, a withdrawal's payout). */
    amountMinor: number | null;
    createdAt: string;
};

export type UserWalletPage = {
    balance: number;
    transactions: LedgerEntry[];
    nextCursor: string | null;
};
