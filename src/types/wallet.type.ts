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