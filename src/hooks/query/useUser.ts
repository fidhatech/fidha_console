import { useQuery } from "@tanstack/react-query";
import type { PaginatedResponse } from "../../types/general.type";
import { type UseQueryParams } from "../../types/general.type";
import type { UserListType } from "../../types/user.type";
import { usersListApi } from "../../api/user.api";

export const useUserQuery = (params: UseQueryParams) => {
  return useQuery<PaginatedResponse<UserListType>>({
    queryKey: [
      "users",
      params
    ],
    queryFn: () =>
      usersListApi(params),
    placeholderData: (previousData) => previousData,
  });
};

