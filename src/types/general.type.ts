export type TokenType = {
  accessToken: string,
  refreshToken: string
}

export type GetParams = {
  page: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  role?: string,
  isBlocked?: boolean;
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
  search: string;
  startDate: string;
  endDate: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  role?: string,
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
