export type TokenType = {
  accessToken: string,
  refreshToken: string
}

export type GetParams = {
  page: number;
  pageSize?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  role?: string,
  gender?: string,
  isBlocked?: boolean;
  /** Ledger type filter (transaction history only). */
  type?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
  };
};

export type UseQueryParams = {
  page: number;
  pageSize?: number;
  search: string;
  startDate: string;
  endDate: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  role?: string,
  gender?: string,
  isBlocked?: boolean;
};

export type RoleFilter = '' | 'client' | 'employee' | 'active' | 'blocked';


export type PayoutHistoryType = {
        id:string,
        name:string,
        date:string,
        amount:number,
        status:boolean,
        transactionId:string,
        /** Coins moved; `amount` is their ₹ value at the current payout rate. */
        coins?: number,
};

export type WithdrawalRequestType = {
  id: string;
  name: string;
  phone: string;
  accountNumber: string;
  ifscCode: string;
  requestedAt: string;
  requestedAmount: number;
  netAmount: number;
  fee: number;
  status: string;
  /** Coins held for the withdrawal. */
  coins?: number;
};

export type WithdrawalRequestResponse = PaginatedResponse<WithdrawalRequestType> & {
  totalRequestedAmount: number;
};

export type DashboardStatistics = {
    data:{
      fidgetData: FidgetStatistics[],
      chartData: CallStatisticsType
    }
};

export type FidgetStatistics = {
    title: string,
    figure: number,
    growth: number,
}
export type CallStatisticsType = {
        days: string[],
        numberOfCalls: number[],
        callTypes: string[],
        callTypeRatio: number[],
        months: string[],
        callCountPerMonth: number[]
};
