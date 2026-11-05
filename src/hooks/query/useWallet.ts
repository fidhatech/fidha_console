import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { TransactionHistoryType, UserWalletPage, WalletFigureType } from "../../types/wallet.type";
import { getWalletTractionApi, transactionHistoryApi, userWalletApi } from "../../api/wallet.api";
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

export const useWalletHistoryQuery = (params: UseQueryParams & { type?: string }) => {
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

const LEDGER_PAGE_SIZE = 20;

/** One account's balance and ledger, newest first, keyset-paged by `nextCursor`. */
export const useUserWalletQuery = (userId: string | undefined) => {
  return useInfiniteQuery<UserWalletPage>({
    queryKey: ["user-wallet", userId],
    enabled: !!userId,
    initialPageParam: undefined,
    queryFn: ({ pageParam }) =>
      userWalletApi(userId as string, {
        cursor: pageParam as string | undefined,
        limit: LEDGER_PAGE_SIZE,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
};
