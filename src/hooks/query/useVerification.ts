import { useQuery } from "@tanstack/react-query";
import type { PaginatedResponse } from "../../types/general.type";
import { type UseQueryParams } from "../../types/general.type";
import { type UserType } from "../../types/user.type";
import { onboardListApi } from "../../api/verification.api";

export const useOnboardQuery = (params: UseQueryParams) => {
  return useQuery<PaginatedResponse<UserType>>({
    queryKey: [
      "verification",
      params
    ],
    queryFn: () =>
      onboardListApi(params),
    placeholderData: (previousData) => previousData,
  });
};