export type WalletFigureType = {
        title: string,
        figure: number,
        growth: number,
};


export type TransactionHistoryType = {
    id: number,
    name: string,
    date: string,
    amount: number,
    status: boolean,
    transactionId: string,
    type?: string,
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
    targetType: BonusCoinsTargetType;
    group?: BonusCoinsTargetGroup;
    userIds?: string[];
};