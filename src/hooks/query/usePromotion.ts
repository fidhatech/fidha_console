import { useQuery } from "@tanstack/react-query";
import { getOffersApi } from "../../api/offer.api";
import type { PaginatedResponse } from "../../types/general.type";
import type { OfferFestivalType } from "../../types/offer.types";
type UseOffersQueryParams = {
  page: number;
  search: string;
  startDate: string;
  endDate: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
};

export const useOffersQuery = (params: UseOffersQueryParams) => {
  return useQuery<PaginatedResponse<OfferFestivalType>>({
    queryKey: [
      "offers",
      params
    ],
    queryFn: () =>
      getOffersApi(params),
    placeholderData: (previousData) => previousData,
  });
};

