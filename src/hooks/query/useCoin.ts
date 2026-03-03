import { useQuery } from "@tanstack/react-query";
import { coinPackageListApi } from "../../api/coin.api";
import type { PaginatedResponse } from "../../types/general.type";
import type { CoinPackageType } from "../../components/coinManagement";
import { type UseQueryParams } from "../../types/general.type";

export const useCoinsQuery = (params: UseQueryParams) => {
  return useQuery<PaginatedResponse<CoinPackageType>>({
    queryKey: [
      "coins",
      params
    ],
    queryFn: () =>
      coinPackageListApi(params),
    placeholderData: (previousData) => previousData,
  });
};

