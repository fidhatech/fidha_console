import { useQuery } from "@tanstack/react-query";
import type { TransactionHistoryType, WalletFigureType } from "../../types/wallet.type";
import { getWalletTractionApi, transactionHistoryApi } from "../../api/wallet.api";
import type { PaginatedResponse, UseQueryParams } from "../../types/general.type";

export const useWalletTractionQuery = () => {
  return useQuery<WalletFigureType[]>({
    queryKey: [
      "wallet-traction",
    ],
    queryFn: () =>
      getWalletTractionApi(),
    placeholderData: (previousData) => previousData,
  });
};

export const useWalletHistoryQuery = (params: UseQueryParams) => {
  return useQuery<PaginatedResponse<TransactionHistoryType>>({
    queryKey: [
      "wallet",
      params
    ],
    queryFn: () =>
      transactionHistoryApi(params),
    placeholderData: (previousData) => previousData,
  });
};

